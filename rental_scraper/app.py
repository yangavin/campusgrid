import os
from flask import Flask, jsonify
from flask_cors import CORS
from scraper import listings

app = Flask(__name__)
CORS(app)

@app.route("/listings")
def get_listings():
    return jsonify(listings)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 3001))  # Use PORT if defined, otherwise 3001
    app.run(host="0.0.0.0", port=port, debug=True)
