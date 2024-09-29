import os
from flask import Flask, jsonify
from flask_cors import CORS
from scraper import get_listings

app = Flask(__name__)
CORS(app)

@app.route("/listings")
def get_listings_route():
    return jsonify(get_listings())

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Use PORT provided by Heroku, default to 5000 for local dev
    app.run(host="0.0.0.0", port=port, debug=False)
