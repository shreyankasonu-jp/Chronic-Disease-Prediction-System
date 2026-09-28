# backend/app.py
# Description: Main Flask application to serve the trained ML models.

import os
import joblib
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import base64

# TensorFlow imports - will be handled gracefully if not available
try:
    import tensorflow as tf
    from tensorflow.keras.models import load_model
    from tensorflow.keras.preprocessing.image import img_to_array
    import cv2
    TENSORFLOW_AVAILABLE = True
except ImportError:
    TENSORFLOW_AVAILABLE = False
    print("TensorFlow not available. Using sklearn pneumonia model.")

def extract_image_features_for_prediction(image, target_size=(150, 150)):
    """Extract features from PIL image for sklearn pneumonia model"""
    try:
        # Convert to grayscale and resize
        if image.mode != 'L':
            image = image.convert('L')
        image = image.resize(target_size)
        
        # Convert to numpy array and normalize
        image_array = np.array(image) / 255.0
        
        # Extract various features (same as training)
        features = []
        
        # 1. Histogram features (intensity distribution)
        hist, _ = np.histogram(image_array, bins=32, range=(0, 1))
        features.extend(hist)
        
        # 2. Statistical features
        features.extend([
            np.mean(image_array),
            np.std(image_array),
            np.min(image_array),
            np.max(image_array),
            np.median(image_array)
        ])
        
        # 3. Simple gradient approximation using numpy
        grad_x = np.gradient(image_array, axis=1)
        grad_y = np.gradient(image_array, axis=0)
        
        features.extend([
            np.mean(np.abs(grad_x)),
            np.std(np.abs(grad_x)),
            np.mean(np.abs(grad_y)),
            np.std(np.abs(grad_y))
        ])
        
        # 4. Texture features - variance in local regions
        h, w = image_array.shape
        block_size = 10
        variances = []
        for i in range(0, h-block_size, block_size):
            for j in range(0, w-block_size, block_size):
                block = image_array[i:i+block_size, j:j+block_size]
                variances.append(np.var(block))
        
        features.extend([
            np.mean(variances),
            np.std(variances),
            np.max(variances)
        ])
        
        # 5. Reduced pixel features (downsample for computational efficiency)
        small_image = np.array(image.resize((20, 20)))
        features.extend(small_image.flatten())
        
        return np.array(features).reshape(1, -1)
        
    except Exception as e:
        print(f"Error extracting features: {e}")
        return None

# --- Initialization ---
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}) # Allow all origins for development

# --- Helper Function for Grad-CAM ---
# This function generates a heatmap for the CNN's prediction.
def make_gradcam_heatmap(img_array, model, last_conv_layer_name, pred_index=None):
    """
    Generates a Grad-CAM heatmap.
    img_array: Preprocessed image array.
    model: The trained Keras model.
    last_conv_layer_name: The name of the last convolutional layer in your model.
    """
    # Create a model that maps the input image to the activations
    # of the last conv layer as well as the output predictions
    grad_model = tf.keras.models.Model(
        [model.inputs], [model.get_layer(last_conv_layer_name).output, model.output]
    )

    # Then, we compute the gradient of the top predicted class for our input image
    # with respect to the activations of the last conv layer
    with tf.GradientTape() as tape:
        last_conv_layer_output, preds = grad_model(img_array)
        if pred_index is None:
            pred_index = tf.argmax(preds[0])
        class_channel = preds[:, pred_index]

    # This is the gradient of the output neuron (top predicted or chosen)
    # with regard to the output feature map of the last conv layer
    grads = tape.gradient(class_channel, last_conv_layer_output)

    # This is a vector where each entry is the mean intensity of the gradient
    # over a specific feature map channel
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    # We multiply each channel in the feature map array
    # by "how important this channel is" with regard to the top predicted class
    # then sum all the channels to obtain the heatmap class activation
    last_conv_layer_output = last_conv_layer_output[0]
    heatmap = last_conv_layer_output @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)

    # For visualization purpose, we will also normalize the heatmap between 0 & 1
    heatmap = tf.maximum(heatmap, 0) / tf.math.reduce_max(heatmap)
    return heatmap.numpy()


def overlay_heatmap(original_img, heatmap, alpha=0.4):
    """
    Overlays the heatmap on the original image.
    """
    # Resize heatmap to match original image dimensions
    heatmap = cv2.resize(heatmap, (original_img.shape[1], original_img.shape[0]))
    heatmap = np.uint8(255 * heatmap)
    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

    # Superimpose the heatmap on original image
    superimposed_img = heatmap * alpha + original_img
    superimposed_img = np.clip(superimposed_img, 0, 255).astype(np.uint8)
    return superimposed_img


# --- Model Loading ---
models = {}
models_dir = 'models'
try:
    # Stroke models
    if os.path.exists(os.path.join(models_dir, 'stroke_model.pkl')):
        models['stroke_model'] = joblib.load(os.path.join(models_dir, 'stroke_model.pkl'))
        models['imputer_stroke'] = joblib.load(os.path.join(models_dir, 'imputer_stroke.pkl'))
        print("✓ Stroke models loaded successfully!")
    else:
        print("⚠ Stroke models not found. Run train_tabular.py to create them.")

    # Diabetes models
    if os.path.exists(os.path.join(models_dir, 'diabetes_model.pkl')):
        models['diabetes_model'] = joblib.load(os.path.join(models_dir, 'diabetes_model.pkl'))
        models['imputer_diabetes'] = joblib.load(os.path.join(models_dir, 'imputer_diabetes.pkl'))
        print("✓ Diabetes models loaded successfully!")
    else:
        print("⚠ Diabetes models not found. Run train_tabular.py to create them.")
    
    # Pneumonia sklearn model (preferred)
    if os.path.exists(os.path.join(models_dir, 'pneumonia_sklearn_model.pkl')):
        models['pneumonia_sklearn_model'] = joblib.load(os.path.join(models_dir, 'pneumonia_sklearn_model.pkl'))
        models['pneumonia_scaler'] = joblib.load(os.path.join(models_dir, 'pneumonia_scaler.pkl'))
        print("✓ Pneumonia sklearn model loaded successfully!")
    # Fallback to TensorFlow model if sklearn not available
    elif TENSORFLOW_AVAILABLE and os.path.exists(os.path.join(models_dir, 'pneumonia_model.h5')):
        models['pneumonia_model'] = load_model(os.path.join(models_dir, 'pneumonia_model.h5'))
        print("✓ Pneumonia TensorFlow model loaded successfully!")
    else:
        print("⚠ No pneumonia model available.")

    if not models:
        print("No models loaded. The API will use mock predictions.")

except Exception as e:
    print(f"Error loading models: {e}")
    print("The API will continue with available models or mock predictions.")
    if not models:
        models = {}

# --- API Routes ---

@app.route('/api/model/info', methods=['GET'])
def model_info():
    """Get information about loaded models"""
    if models is None:
        return jsonify({'error': 'Models not loaded'}), 500
    
    info = {
        'models_loaded': list(models.keys()),
        'pneumonia_model_summary': str(models['pneumonia_model'].summary()) if 'pneumonia_model' in models else None
    }
    return jsonify(info)

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    if data.get('username') == 'admin' and data.get('password') == 'admin':
        return jsonify({'token': 'mock-jwt-token-for-admin', 'message': 'Login successful'}), 200
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/pneumonia/predict', methods=['POST'])
def predict_pneumonia():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        # Load image from uploaded file
        file.stream.seek(0)  # Reset stream position
        image = Image.open(file.stream).convert('RGB')
        
        if 'pneumonia_sklearn_model' in models:
            # Use sklearn model (preferred)
            print("Using sklearn pneumonia model")
            
            # Extract features from the image
            features = extract_image_features_for_prediction(image)
            if features is None:
                return jsonify({'error': 'Failed to extract image features'}), 500
            
            # Scale features
            features_scaled = models['pneumonia_scaler'].transform(features)
            
            # Make prediction
            probability = models['pneumonia_sklearn_model'].predict_proba(features_scaled)[0][1]
            
            threshold = 0.5
            label = 1 if probability >= threshold else 0
            prediction_text = "PNEUMONIA" if label == 1 else "NORMAL"
            confidence = probability if label == 1 else (1 - probability)
            
            return jsonify({
                'label': int(label),
                'probability': float(probability),
                'prediction': prediction_text,
                'confidence': float(confidence),
                'threshold_used': threshold,
                'heatmap': None,  # Sklearn model doesn't generate heatmaps
                'mock_prediction': False,
                'model_type': 'sklearn'
            })
            
        elif TENSORFLOW_AVAILABLE and 'pneumonia_model' in models:
            # Fallback to TensorFlow model
            print("Using TensorFlow pneumonia model")
            image = image.resize((150, 150))
            
            img_array_pred = img_to_array(image)
            img_array_pred = np.expand_dims(img_array_pred, axis=0) / 255.0

            model = models['pneumonia_model']
            raw_prediction = model.predict(img_array_pred, verbose=0)
            probability = float(raw_prediction[0][0])
            
            threshold = 0.7
            label = 1 if probability >= threshold else 0
            prediction_text = "PNEUMONIA" if label == 1 else "NORMAL"
            confidence = probability if label == 1 else (1 - probability)
            
            # Generate Grad-CAM Heatmap
            heatmap_b64 = None
            try:
                conv_layers = [layer.name for layer in model.layers if isinstance(layer, tf.keras.layers.Conv2D)]
                if conv_layers:
                    last_conv_layer_name = conv_layers[-1]
                    original_img_np = np.array(image)
                    heatmap = make_gradcam_heatmap(img_array_pred, model, last_conv_layer_name)
                    overlay = overlay_heatmap(original_img_np, heatmap)
                    _, buffer = cv2.imencode('.png', cv2.cvtColor(overlay, cv2.COLOR_RGB2BGR))
                    heatmap_b64 = base64.b64encode(buffer).decode('utf-8')
            except Exception as heatmap_error:
                print(f"Heatmap generation failed: {heatmap_error}")
                heatmap_b64 = None
                
            return jsonify({
                'label': int(label),
                'probability': float(probability),
                'prediction': prediction_text,
                'confidence': float(confidence),
                'threshold_used': threshold,
                'heatmap': heatmap_b64,
                'mock_prediction': False,
                'model_type': 'tensorflow'
            })
        else:
            # Mock prediction when no models are available
            print("Using mock pneumonia prediction (no models available)")
            
            # Simple mock based on filename hash for consistency
            filename_hash = sum(ord(c) for c in file.filename)
            probability = (filename_hash % 100) / 100.0  # 0.0 to 1.0
            
            threshold = 0.6
            label = 1 if probability >= threshold else 0
            prediction_text = "PNEUMONIA" if label == 1 else "NORMAL"
            confidence = probability if label == 1 else (1 - probability)
            
            return jsonify({
                'label': int(label),
                'probability': float(probability),
                'prediction': prediction_text,
                'confidence': float(confidence),
                'threshold_used': threshold,
                'heatmap': None,
                'mock_prediction': True,
                'model_type': 'mock'
            })

    except Exception as e:
        print(f"Pneumonia prediction error: {str(e)}")
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500


@app.route('/api/stroke/predict', methods=['POST'])
def predict_stroke():
    if models is None:
        return jsonify({'error': 'Models not loaded'}), 500
        
    data = request.get_json()
    if not data or 'features' not in data:
        return jsonify({'error': 'Invalid input'}), 400
    
    try:
        features = np.array(data['features']).reshape(1, -1)
        
        # The imputer from your script handles missing values
        features_imputed = models['imputer_stroke'].transform(features)
        
        # The model predicts the probability
        probability = models['stroke_model'].predict_proba(features_imputed)[0][1]
        label = 1 if probability >= 0.55 else 0

        return jsonify({
            'label': int(label),
            'probability': float(probability)
        })

    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500


@app.route('/api/diabetes/predict', methods=['POST'])
def predict_diabetes():
    if models is None:
        return jsonify({'error': 'Models not loaded'}), 500

    data = request.get_json()
    if not data or 'features' not in data:
        return jsonify({'error': 'Invalid input'}), 400
    
    try:
        features = np.array(data['features']).reshape(1, -1)

        # The imputer from your script handles missing values
        features_imputed = models['imputer_diabetes'].transform(features)
        
        # The model predicts the probability
        probability = models['diabetes_model'].predict_proba(features_imputed)[0][1]
        label = 1 if probability >= 0.5 else 0

        return jsonify({
            'label': int(label),
            'probability': float(probability)
        })

    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

# --- Main Execution ---
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
