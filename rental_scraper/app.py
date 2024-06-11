from scraper import listings
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/listings")
def get_listings():
    return jsonify(listings)


app.run(port=3001, debug=True)
