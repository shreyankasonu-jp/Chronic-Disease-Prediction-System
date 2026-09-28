# backend/train_pneumonia_sklearn.py
# Description: Train a pneumonia detection model using scikit-learn with image features

import os
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import StandardScaler
import joblib
from PIL import Image
import glob

def extract_image_features(image_path, target_size=(150, 150)):
    """Extract features from an image for ML model using PIL only"""
    try:
        # Load and preprocess image using PIL
        image = Image.open(image_path).convert('L')  # Convert to grayscale
        image = image.resize(target_size)
        
        # Convert to numpy array and normalize
        image_array = np.array(image) / 255.0
        
        # Extract various features
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
        
        return np.array(features)
        
    except Exception as e:
        print(f"Error processing {image_path}: {e}")
        return None

def load_dataset():
    """Load and process the pneumonia dataset"""
    print("Loading dataset...")
    
    # Paths to data
    normal_path = "data/train/NORMAL"
    pneumonia_path = "data/train/PNEUMONIA"
    
    # Get all image files
    normal_files = glob.glob(os.path.join(normal_path, "*.jpeg")) + glob.glob(os.path.join(normal_path, "*.jpg"))
    pneumonia_files = glob.glob(os.path.join(pneumonia_path, "*.jpeg")) + glob.glob(os.path.join(pneumonia_path, "*.jpg"))
    
    print(f"Found {len(normal_files)} normal images")
    print(f"Found {len(pneumonia_files)} pneumonia images")
    
    # Limit dataset size for faster training (you can increase this)
    max_samples_per_class = 500
    normal_files = normal_files[:max_samples_per_class]
    pneumonia_files = pneumonia_files[:max_samples_per_class]
    
    print(f"Using {len(normal_files)} normal and {len(pneumonia_files)} pneumonia images")
    
    features = []
    labels = []
    
    # Process normal images
    print("Processing normal images...")
    for i, img_path in enumerate(normal_files):
        if i % 50 == 0:
            print(f"Processed {i}/{len(normal_files)} normal images")
        
        feat = extract_image_features(img_path)
        if feat is not None:
            features.append(feat)
            labels.append(0)  # 0 for normal
    
    # Process pneumonia images
    print("Processing pneumonia images...")
    for i, img_path in enumerate(pneumonia_files):
        if i % 50 == 0:
            print(f"Processed {i}/{len(pneumonia_files)} pneumonia images")
        
        feat = extract_image_features(img_path)
        if feat is not None:
            features.append(feat)
            labels.append(1)  # 1 for pneumonia
    
    return np.array(features), np.array(labels)

def train_model():
    """Train the pneumonia detection model"""
    print("=== Training Pneumonia Detection Model ===")
    
    # Create models directory if it doesn't exist
    if not os.path.exists('models'):
        os.makedirs('models')
    
    # Load dataset
    X, y = load_dataset()
    
    print(f"Dataset shape: {X.shape}")
    print(f"Labels shape: {y.shape}")
    print(f"Normal cases: {np.sum(y == 0)}")
    print(f"Pneumonia cases: {np.sum(y == 1)}")
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Scale the features
    print("Scaling features...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train Random Forest model
    print("Training Random Forest model...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=20,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_train_scaled, y_train)
    
    # Evaluate the model
    print("Evaluating model...")
    y_pred = model.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"Test Accuracy: {accuracy:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=['Normal', 'Pneumonia']))
    
    # Save the model and scaler
    print("Saving model and scaler...")
    joblib.dump(model, 'models/pneumonia_sklearn_model.pkl')
    joblib.dump(scaler, 'models/pneumonia_scaler.pkl')
    
    print("✓ Pneumonia model training completed!")
    print("✓ Saved pneumonia_sklearn_model.pkl and pneumonia_scaler.pkl")
    
    return model, scaler

if __name__ == "__main__":
    train_model()