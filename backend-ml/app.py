from flask import Flask, request, jsonify
from flask_cors import CORS
from joblib import load

app = Flask(__name__)
CORS(app)

model = load("model_gaya_belajar.pkl")

def validasi_hasil_ml(visual, auditory, kinesthetic, hasil_ml):
    scores = {
        "visual": visual,
        "auditory": auditory,
        "kinesthetic": kinesthetic
    }

    sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)

    top, second = sorted_scores[0], sorted_scores[1]

    # Jika dominan jelas → override ML
    if top[1] - second[1] >= 2:
        return top[0]

    # Jika seimbang → gunakan ML
    return hasil_ml.replace("_", "-")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    visual = int(data["visual"])
    auditory = int(data["auditory"])
    kinesthetic = int(data["kinesthetic"])

    ml_result = model.predict([[visual, auditory, kinesthetic]])[0]

    final_result = validasi_hasil_ml(
        visual, auditory, kinesthetic, ml_result
    )

    return jsonify({ "hasil": final_result })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
