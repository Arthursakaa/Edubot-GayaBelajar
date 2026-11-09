"""
EduBot Gaya Belajar - Script Evaluasi Machine Learning Ilmiah
Mengevaluasi dataset_gayabelajar.csv secara riil tanpa manipulasi atau data sintetis.
"""

import os
import pandas as pd
import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import StratifiedKFold, cross_val_predict, cross_val_score
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix
)
from joblib import load

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, "dataset_gayabelajar.csv")
MODEL_PATH = os.path.join(BASE_DIR, "model_gaya_belajar.pkl")

def run_ml_evaluation():
    print("=" * 65)
    print("      EVALUASI MACHINE LEARNING EDUBOT - DATASET RIIL")
    print("=" * 65)

    # 1. Pemeriksaan Data Quality
    data = pd.read_csv(DATASET_PATH)
    print("\n[1] DATA QUALITY AUDIT:")
    print(f"    - Total baris: {len(data)}")
    print(f"    - Missing values: {data.isnull().sum().to_dict()}")
    print(f"    - Tipe data:\n{data.dtypes.to_string()}")
    print("\n    - Rentang Fitur:")
    for col in ['visual', 'auditory', 'kinesthetic']:
        print(f"      * {col}: Min={data[col].min()}, Max={data[col].max()}, Mean={data[col].mean():.2f}")

    # 2. Distribusi Kelas
    print("\n[2] DISTRIBUSI KELAS RIIL:")
    class_counts = data['hasil'].value_counts()
    for label, count in class_counts.items():
        pct = (count / len(data)) * 100
        print(f"    - {label:<22}: {count} sampel ({pct:.1f}%)")

    X = data[['visual', 'auditory', 'kinesthetic']]
    y = data['hasil']
    unique_classes = np.unique(y)

    # 3. Validasi Model dengan Stratified K-Fold Cross Validation (k=3)
    # k=3 dipilih karena kelas terkecil memiliki minimal 2 sampel (auditory_kinesthetic=2, visual_kinesthetic=2)
    # StratifiedKFold membagi data secara proporsional per fold
    skf = StratifiedKFold(n_splits=2, shuffle=True, random_state=42)
    dt_model = DecisionTreeClassifier(criterion="entropy", random_state=42)

    y_pred_cv = cross_val_predict(dt_model, X, y, cv=skf)

    acc = accuracy_score(y, y_pred_cv)
    prec_macro = precision_score(y, y_pred_cv, average="macro", zero_division=0)
    rec_macro = recall_score(y, y_pred_cv, average="macro", zero_division=0)
    f1_macro = f1_score(y, y_pred_cv, average="macro", zero_division=0)

    prec_weighted = precision_score(y, y_pred_cv, average="weighted", zero_division=0)
    rec_weighted = recall_score(y, y_pred_cv, average="weighted", zero_division=0)
    f1_weighted = f1_score(y, y_pred_cv, average="weighted", zero_division=0)

    print("\n[3] HASIL METRIK CROSS-VALIDATION (Zero Data Leakage, k=2 Stratified):")
    print(f"    - Accuracy           : {acc:.4f} ({acc*100:.2f}%)")
    print(f"    - Precision (Macro)  : {prec_macro:.4f}")
    print(f"    - Recall (Macro)     : {rec_macro:.4f}")
    print(f"    - F1-Score (Macro)   : {f1_macro:.4f}")
    print(f"    - F1-Score (Weighted): {f1_weighted:.4f}")

    print("\n[4] CLASSIFICATION REPORT DETAIL (Per Kelas):")
    print(classification_report(y, y_pred_cv, zero_division=0))

    print("[5] CONFUSION MATRIX:")
    cm = confusion_matrix(y, y_pred_cv, labels=unique_classes)
    cm_df = pd.DataFrame(cm, index=[f"True:{c}" for c in unique_classes], columns=[f"Pred:{c}" for c in unique_classes])
    print(cm_df.to_string())

    # 4. Verifikasi Model Serialization
    print("\n[6] VERIFIKASI MODEL SERIALIZATION (model_gaya_belajar.pkl):")
    if os.path.exists(MODEL_PATH):
        saved_model = load(MODEL_PATH)
        print("    - Model file terdeteksi:", MODEL_PATH)
        print("    - Tipe Estimator       :", type(saved_model))
        print("    - Parameter Estimator  :", saved_model.get_params())
        
        # Test inferensi konsisten
        test_case = [[5, 2, 1]]
        pred = saved_model.predict(test_case)[0]
        print(f"    - Uji Inferensi [visual=5, auditory=2, kinesthetic=1]: -> '{pred}'")
    else:
        print("    - Model file tidak ditemukan!")

    # 5. Analisis Kritis Kesenjangan Domain (Inference vs Training)
    print("\n[7] ANALISIS KESENJANGAN SKALA FITUR (Feature Domain Gap):")
    print("    - Dataset Training : Fitur berkisar 1 - 5 (skor tes mini).")
    print("    - Frontend Riil    : Tes berisi 10 pertanyaan (skor individu bisa mencapai 0 - 10).")
    print("    - Rekomendasi Solusi: Normalisasi min-max atau rasio persentase sebelum input inferensi.")

if __name__ == "__main__":
    run_ml_evaluation()

