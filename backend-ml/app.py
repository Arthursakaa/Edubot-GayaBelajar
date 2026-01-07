from flask import Flask, request, jsonify
from flask_cors import CORS
from joblib import load

app = Flask(__name__)
CORS(app)

model = load("model_gaya_belajar.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    visual = data.get("visual")
    auditory = data.get("auditory")
    kinesthetic = data.get("kinesthetic")

    prediction = model.predict([[visual, auditory, kinesthetic]])

    return jsonify({
        "hasil": prediction[0]
    })

if __name__ == "__main__":
    app.run(port=5000, debug=True)