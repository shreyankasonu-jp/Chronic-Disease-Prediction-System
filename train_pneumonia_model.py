# backend/train_pneumonia_model.py
# Description: Trains a CNN for pneumonia detection using TensorFlow/Keras.

import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout, BatchNormalization
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import os

# --- Configuration ---
IMG_WIDTH, IMG_HEIGHT = 150, 150
BATCH_SIZE = 32
EPOCHS = 25 # Increase for better accuracy, but watch for overfitting

# --- Data Paths ---
# Assumes data is organized in 'backend/data/'
base_dir = 'data'
train_dir = os.path.join(base_dir, 'train')
test_dir = os.path.join(base_dir, 'test')

# --- Data Augmentation and Loading ---
# Create an ImageDataGenerator to augment images and normalize pixel values
# Augmentation helps prevent overfitting and improves model generalization
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode='nearest'
)

# For the test set, we only need to rescale the pixels, no augmentation
test_datagen = ImageDataGenerator(rescale=1./255)

# Create generators to load images from directories
train_generator = train_datagen.flow_from_directory(
    train_dir,
    target_size=(IMG_WIDTH, IMG_HEIGHT),
    batch_size=BATCH_SIZE,
    class_mode='binary' # 'binary' because we have two classes (NORMAL, PNEUMONIA)
)

test_generator = test_datagen.flow_from_directory(
    test_dir,
    target_size=(IMG_WIDTH, IMG_HEIGHT),
    batch_size=BATCH_SIZE,
    class_mode='binary'
)

# --- CNN Model Definition ---
# A sequential model with several convolutional and pooling layers.
model = Sequential([
    # First Convolutional Block
    Conv2D(32, (3, 3), activation='relu', input_shape=(IMG_WIDTH, IMG_HEIGHT, 3)),
    BatchNormalization(),
    MaxPooling2D(pool_size=(2, 2)),

    # Second Convolutional Block
    Conv2D(64, (3, 3), activation='relu'),
    BatchNormalization(),
    MaxPooling2D(pool_size=(2, 2)),

    # Third Convolutional Block
    Conv2D(128, (3, 3), activation='relu'),
    BatchNormalization(),
    MaxPooling2D(pool_size=(2, 2)),

    # Flatten the results to feed into a dense layer
    Flatten(),

    # Dense Layers for Classification
    Dense(512, activation='relu'),
    Dropout(0.5), # Dropout helps prevent overfitting
    Dense(1, activation='sigmoid') # Sigmoid activation for binary classification
])

# --- Compile the Model ---
model.compile(
    optimizer='adam',
    loss='binary_crossentropy',
    metrics=['accuracy']
)

# --- Model Summary ---
model.summary()

# --- Train the Model ---
print("\nStarting model training...")
print(f"Training samples: {train_generator.samples}")
print(f"Test samples: {test_generator.samples}")
print(f"Steps per epoch: {max(1, train_generator.samples // BATCH_SIZE)}")

history = model.fit(
    train_generator,
    steps_per_epoch=max(1, train_generator.samples // BATCH_SIZE),
    epochs=EPOCHS,
    validation_data=test_generator,
    validation_steps=max(1, test_generator.samples // BATCH_SIZE)
)

# --- Evaluate the Model ---
print("\nEvaluating model on the test set...")
loss, accuracy = model.evaluate(test_generator)
print(f"Test Accuracy: {accuracy*100:.2f}%")
print(f"Test Loss: {loss:.4f}")

# --- Save the Model ---
# The trained model will be saved in the 'models' directory.
if not os.path.exists('models'):
    os.makedirs('models')
model.save('models/pneumonia_model.h5')
print("\nModel saved successfully as 'models/pneumonia_model.h5'")
