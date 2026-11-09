"""
Unit & Pipeline Testing untuk Backend Machine Learning EduBot
"""

import os
import unittest
import json
from joblib import load

# Import modul Flask app
import sys
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from app import app, validasi_hasil_ml, MODEL_PATH

class TestEduBotML(unittest.TestCase):

    def setUp(self):
        self.client = app.test_client()
        self.client.testing = True

    def test_01_model_file_exists_and_loads(self):
        """Memastikan file model_gaya_belajar.pkl ada dan dapat di-load"""
        self.assertTrue(os.path.exists(MODEL_PATH), "File model_gaya_belajar.pkl harus tersedia")
        model = load(MODEL_PATH)
        self.assertIsNotNone(model, "Model tidak boleh None")
        self.assertTrue(hasattr(model, "predict"), "Model harus memiliki method predict")

    def test_02_health_endpoint(self):
        """Menguji endpoint GET /health"""
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data.get("status"), "healthy")
        self.assertTrue(data.get("model_loaded"))

    def test_03_predict_valid_payload(self):
        """Menguji inferensi prediksi dengan payload normal (skala mini)"""
        payload = {"visual": 5, "auditory": 2, "kinesthetic": 1}
        response = self.client.post(
            "/predict",
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data.get("status"), "success")
        self.assertIn("hasil", data)
        self.assertEqual(data["hasil"], "visual")

    def test_04_predict_scaled_domain(self):
        """Menguji penskalaan fitur domain dari kuis 10 pertanyaan (total > 5)"""
        payload = {"visual": 8, "auditory": 1, "kinesthetic": 1}
        response = self.client.post(
            "/predict",
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["hasil"], "visual")

    def test_05_predict_missing_fields(self):
        """Menguji penolakan payload yang tidak lengkap (400 Bad Request)"""
        payload = {"visual": 5}
        response = self.client.post(
            "/predict",
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)
        data = response.get_json()
        self.assertIn("error", data)

    def test_06_predict_negative_score(self):
        """Menguji penolakan skor negatif (400 Bad Request)"""
        payload = {"visual": -3, "auditory": 2, "kinesthetic": 1}
        response = self.client.post(
            "/predict",
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)
        data = response.get_json()
        self.assertIn("error", data)

    def test_07_validation_heuristic_dominant(self):
        """Menguji fungsi heuristik: jika selisih >= 2 maka dominan tunggal"""
        result = validasi_hasil_ml(visual=5, auditory=2, kinesthetic=1, hasil_ml="visual_auditory")
        self.assertEqual(result, "visual")

    def test_08_validation_heuristic_balanced(self):
        """Menguji fungsi heuristik: jika skor imbang (< 2) maka gunakan hasil ML multimodal"""
        result = validasi_hasil_ml(visual=4, auditory=4, kinesthetic=2, hasil_ml="visual_auditory")
        self.assertEqual(result, "visual-auditory")

if __name__ == "__main__":
    unittest.main()

