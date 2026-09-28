# Chronic Disease Prediction System

A machine learning-based web application that helps predict the possibility of different chronic diseases using patient-provided information and medical images.

## Project Overview

The Chronic Disease Prediction System is designed to provide prediction results for:

- Diabetes
- Stroke
- Pneumonia

The system uses different machine learning and deep learning models depending on the disease.

## Technologies Used

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

### Backend
- Python
- Flask
- REST API

### Machine Learning
- CNN
- Logistic Regression
- Random Forest
- Scikit-learn
- TensorFlow/Keras

### Database / Storage
- Local Storage
- Machine Learning Model Files

## Features

- User Login and Authentication
- Diabetes Prediction
- Stroke Prediction
- Pneumonia Detection from X-ray Images
- Dashboard
- Prediction Results
- Medical Information
- Responsive User Interface

## Machine Learning Models

| Disease | Model |
|---|---|
| Diabetes | Random Forest |
| Stroke | Logistic Regression |
| Pneumonia | CNN |

## Project Structure

```text
Chronic-Disease-Prediction-System/
│
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── models/
│
├── Frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── README.md
└── .gitignoreRead more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

How It Works
User logs into the system.
User selects a disease prediction module.
Required information or medical image is provided.
The backend processes the input using the corresponding machine learning model.
The prediction result is displayed to the user.

How to Run
Backend
cd backend
pip install -r requirements.txt
python app.py

Frontend
cd Frontend
npm install
npm run dev

Future Scope
Improve model accuracy with larger datasets
Add more disease prediction modules
Deploy the application to the cloud
Add real-time monitoring features
Develop a mobile application
Disclaimer

This project is developed for educational purposes. The predictions provided by the system should not be considered a medical diagnosis or a substitute for professional medical advice.

### One important correction

Your project uses **Logistic Regression for stroke** and **Random Forest for diabetes**, so keep that table only if it matches your actual code.

For **Pneumonia**, your large `pneumonia_model.h5` wasn't uploaded to GitHub, so don't claim that someone can run the pneumonia CNN directly from the repository unless you provide a way to obtain that model.

After pasting this into `README.md`, click **Commit changes → Commit directly to main**.
