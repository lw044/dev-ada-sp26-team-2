import sys
sys.path.append("/Users/camillaforero/random coding/dev-ada-sp26-team-2/vibe-check/modal/inference.py")
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # needed so the extension can call it

@app.route("/analyze", methods=["POST"])
def analyze():
    text = request.json["text"]
    score = predict_sentiment(text)
    return jsonify({ "score": score })

app.run(port=5000)
