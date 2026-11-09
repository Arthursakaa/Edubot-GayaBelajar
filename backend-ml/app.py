import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from joblib import load

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model_gaya_belajar.pkl")
model = load(MODEL_PATH)

def validasi_hasil_ml(visual, auditory, kinesthetic, hasil_ml):
    scores = {
        "visual": visual,
        "auditory": auditory,
        "kinesthetic": kinesthetic
    }

    sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    top, second = sorted_scores[0], sorted_scores[1]

    # Heuristik toleransi dominansi mutlak
    if top[1] - second[1] >= 2:
        return top[0]

    return hasil_ml.replace("_", "-")

@app.route("/", methods=["GET"])
def index():
    return jsonify({
        "service": "EduBot Machine Learning Microservice",
        "status": "online",
        "model": "DecisionTreeClassifier (Entropy)"
    })

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None,
        "model_path": MODEL_PATH
    }), 200

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body harus berupa JSON valid"}), 400

    required_fields = ["visual", "auditory", "kinesthetic"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Field '{field}' wajib disertakan"}), 400

    try:
        visual = float(data["visual"])
        auditory = float(data["auditory"])
        kinesthetic = float(data["kinesthetic"])
        if visual < 0 or auditory < 0 or kinesthetic < 0:
            return jsonify({"error": "Skor tidak boleh bernilai negatif"}), 400
    except (ValueError, TypeError):
        return jsonify({"error": "Skor harus berupa nilai numerik valid"}), 400

    # Domain Scale Matching: jika total skor > 5 (skala kuis riil 10 pertanyaan),
    # sesuaikan ke proporsi skala latih (1-5) untuk inferensi model
    total = visual + auditory + kinesthetic
    if total > 5:
        factor = 5.0 / max(total, 1.0)
        v_scaled = round(visual * factor)
        a_scaled = round(auditory * factor)
        k_scaled = round(kinesthetic * factor)
        input_vector = [[max(v_scaled, 1), max(a_scaled, 1), max(k_scaled, 1)]]
    else:
        input_vector = [[int(visual), int(auditory), int(kinesthetic)]]

    ml_result = model.predict(input_vector)[0]
    final_result = validasi_hasil_ml(visual, auditory, kinesthetic, ml_result)

    return jsonify({
        "status": "success",
        "hasil": final_result,
        "raw_ml": ml_result
    }), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
