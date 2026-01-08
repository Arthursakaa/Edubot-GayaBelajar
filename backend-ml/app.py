import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from joblib import load

app = Flask(__name__)
CORS(app)

# Load model
model = load("model_gaya_belajar.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No JSON data received"}), 400

    try:
        visual = float(data.get("visual", 0))
        auditory = float(data.get("auditory", 0))
        kinesthetic = float(data.get("kinesthetic", 0))

        prediction = model.predict([[visual, auditory, kinesthetic]])

        return jsonify({
            "hasil": prediction[0]
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
