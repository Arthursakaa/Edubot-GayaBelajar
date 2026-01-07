import pandas as pd
import os
from sklearn.tree import DecisionTreeClassifier
from joblib import dump

# ==============================
# PATH AMAN (ANTI ERROR)
# ==============================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, "dataset_gayabelajar.csv")
MODEL_PATH = os.path.join(BASE_DIR, "model_gaya_belajar.pkl")

# ==============================
# LOAD DATASET
# ==============================
data = pd.read_csv(DATASET_PATH)

# Fitur dan label
X = data[['visual', 'auditory', 'kinesthetic']]
y = data['hasil']

# ==============================
# TRAIN MODEL
# ==============================
model = DecisionTreeClassifier(criterion="entropy")
model.fit(X, y)

# ==============================
# SAVE MODEL
# ==============================
dump(model, MODEL_PATH)

print("✅ Model berhasil dilatih dan disimpan.")
print("📁 Lokasi model:", MODEL_PATH)
