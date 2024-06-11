from scraper import listings
from flask import Flask, jsonify

app = Flask(__name__)


@app.route("/listings")
def get_listings():
    return jsonify(listings)


app.run(port=3000, debug=True)
