# backend/train_tabular_model.py
# Description: A general-purpose script to train models for stroke and diabetes from CSV data.
# This version has corrected file paths.

import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
import os

# --- Create models directory if it doesn't exist ---
if not os.path.exists('models'):
    os.makedirs('models')

# --- Stroke Model Training ---
print("--- Training Stroke Model ---")
# Corrected path: 'data/' instead of '../data/'
df_stroke = pd.read_csv("data/stroke/healthcare-dataset-stroke-data.csv")
df_stroke.drop(columns=["id"], inplace=True, errors='ignore')

# Encode categorical to numeric consistently
for col in df_stroke.select_dtypes(include='object').columns:
    df_stroke[col] = LabelEncoder().fit_transform(df_stroke[col].astype(str))

X = df_stroke.drop("stroke", axis=1)
y = df_stroke["stroke"]

imputer = SimpleImputer(strategy='mean')
X = pd.DataFrame(imputer.fit_transform(X), columns=X.columns)

# Split the data (without SMOTE for now)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
stroke_model = LogisticRegression(max_iter=1000)
stroke_model.fit(X_train, y_train)

# Corrected paths for saving the models
joblib.dump(stroke_model, "models/stroke_model.pkl")
joblib.dump(imputer, "models/imputer_stroke.pkl")
print("Saved stroke_model.pkl and imputer_stroke.pkl\n")


# --- Diabetes Model Training ---
print("--- Training Diabetes Model ---")
# Corrected path: 'data/' instead of '../data/'
df_diabetes = pd.read_csv("data/diabetes/diabetes.csv")

# if target name is Outcome
if 'Outcome' in df_diabetes.columns:
    target = 'Outcome'
else:
    target = df_diabetes.columns[-1]

X_diab = df_diabetes.drop(target, axis=1)
y_diab = df_diabetes[target]

imputer2 = SimpleImputer(strategy='mean')
X_diab_imputed = pd.DataFrame(imputer2.fit_transform(X_diab), columns=X_diab.columns)

rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_diab_imputed, y_diab)

# Corrected paths for saving the models
joblib.dump(rf, "models/diabetes_model.pkl")
joblib.dump(imputer2, "models/imputer_diabetes.pkl")
print("Saved diabetes_model.pkl and imputer_diabetes.pkl")
