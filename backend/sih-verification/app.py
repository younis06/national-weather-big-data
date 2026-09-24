import re
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

import joblib
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS


BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "rumour_model_final.pkl"
VECTORIZER_PATH = BASE_DIR / "tfidf_vectorizer_final.pkl"

rumour_model = joblib.load(MODEL_PATH)
vectorizer = joblib.load(VECTORIZER_PATH)

CITY_COORDINATES = {
    "chennai": (13.0827, 80.2707),
    "mumbai": (19.0760, 72.8777),
    "delhi": (28.6139, 77.2090),
    "kolkata": (22.5726, 88.3639),
    "bengaluru": (12.9716, 77.5946),
    "bangalore": (12.9716, 77.5946),
    "hyderabad": (17.3850, 78.4867),
    "pune": (18.5204, 73.8567),
    "ahmedabad": (23.0225, 72.5714),
    "coimbatore": (11.0168, 76.9558),
    "madurai": (9.9252, 78.1198),
    "tiruchirappalli": (10.7905, 78.7047),
    "salem": (11.6643, 78.1460),
    "tirunelveli": (8.7139, 77.7567),
}

TRUSTED_SOURCE_DOMAINS = {
    "aajtak.in",
    "aninews.in",
    "bbc.com",
    "deccanherald.com",
    "economictimes.indiatimes.com",
    "hindustantimes.com",
    "indianexpress.com",
    "ndtv.com",
    "news18.com",
    "pib.gov.in",
    "reuters.com",
    "thehindu.com",
    "timesofindia.indiatimes.com",
    "imd.gov.in",
    "wmo.int",
}

TRUSTED_SOURCE_NAMES = {
    "aaj tak",
    "ani",
    "bbc",
    "deccan herald",
    "economic times",
    "hindustan times",
    "indian express",
    "ndtv",
    "news18",
    "press information bureau",
    "reuters",
    "the hindu",
    "times of india",
    "india meteorological department",
}


def clean_text(text):
    text = str(text).lower()
    text = re.sub(r"https?://\S+|www\.\S+", "", text)
    text = re.sub(r"@\w+", "", text)
    text = re.sub(r"#", "", text)
    return re.sub(r"\s+", " ", text).strip()


def predict_rumour_signal(text):
    text_vector = vectorizer.transform([clean_text(text)])
    prediction = rumour_model.predict(text_vector)[0]
    probabilities = rumour_model.predict_proba(text_vector)[0]
    return {
        "prediction": str(prediction),
        "confidence": round(float(max(probabilities)), 4),
        "probabilities": {
            str(label): round(float(probability), 4)
            for label, probability in zip(rumour_model.classes_, probabilities)
        },
    }


def detect_location(text):
    normalized = clean_text(text)
    for city in sorted(CITY_COORDINATES, key=len, reverse=True):
        if re.search(rf"\b{re.escape(city)}\b", normalized):
            return city
    return None


def detect_event(text):
    normalized = clean_text(text)
    rules = (
        ("cyclone", ("cyclone",)),
        ("flood", ("flood", "waterlogging", "inundation")),
        ("heatwave", ("heatwave", "heat wave")),
        ("strong_wind", ("strong wind", "high wind", "gust", "gale")),
        ("storm", ("thunderstorm", "storm", "lightning")),
        ("rain", ("rain", "rainfall", "raining", "downpour", "precipitation")),
    )
    for event, words in rules:
        if any(word in normalized for word in words):
            return event
    return "unknown"


def normalize_hostname(url):
    try:
        hostname = urlparse(url).hostname
        return hostname.lower().removeprefix("www.") if hostname else None
    except (AttributeError, ValueError):
        return None


def verify_source(source_name, source_url):
    name = clean_text(source_name or "")
    hostname = normalize_hostname(source_url or "")
    trusted_by_domain = hostname in TRUSTED_SOURCE_DOMAINS or any(
        hostname and hostname.endswith(f".{domain}")
        for domain in TRUSTED_SOURCE_DOMAINS
    )
    trusted_by_name = any(trusted_name in name for trusted_name in TRUSTED_SOURCE_NAMES)
    trusted = trusted_by_domain or (not source_url and trusted_by_name)
    return {
        "publisher": source_name or None,
        "url": source_url or None,
        "hostname": hostname,
        "trusted": trusted,
        "basis": "domain" if trusted_by_domain else "publisher identity" if trusted_by_name else None,
        "reason": (
            "Publisher matched the trusted source registry."
            if trusted
            else "Publisher could not be matched to the trusted source registry."
        ),
    }


def get_live_weather(latitude, longitude):
    response = requests.get(
        "https://api.open-meteo.com/v1/forecast",
        params={
            "latitude": latitude,
            "longitude": longitude,
            "current": "temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_gusts_10m",
            "timezone": "auto",
        },
        timeout=15,
    )
    response.raise_for_status()
    return response.json()


def verify_weather(event, weather):
    current = weather.get("current", {})
    precipitation = current.get("precipitation")
    wind = current.get("wind_speed_10m")
    gust = current.get("wind_gusts_10m")
    temperature = current.get("temperature_2m")

    if event == "rain":
        supported = precipitation is not None and precipitation > 0
        return supported, "Current weather data shows precipitation." if supported else "Current weather data does not show precipitation."
    if event == "strong_wind":
        supported = wind is not None and wind >= 40
        return supported, "Current weather data shows strong wind." if supported else "Current weather data does not show strong wind."
    if event == "storm":
        supported = (wind is not None and wind >= 40) or (gust is not None and gust >= 50)
        return supported, "Current weather data shows strong wind or gusts." if supported else "Current weather data does not support a storm claim."
    if event == "heatwave":
        supported = temperature is not None and temperature >= 40
        return supported, "Temperature meets the local heat threshold." if supported else "Temperature does not meet the heatwave threshold; an official warning is also required."
    if event == "cyclone":
        return False, "Cyclone claims require an official cyclone bulletin; weather observations alone are insufficient."
    if event == "flood":
        return False, "Flood claims require water-level, flood-monitoring, or official emergency evidence."
    return False, "Weather event could not be detected."


def parse_published_at(value):
    if not value:
        return None


def validate_payload(payload):
    if not isinstance(payload, dict):
        raise ValueError("JSON object is required")
    news = str(payload.get("news", "")).strip()
    if not 10 <= len(news) <= 5000:
        raise ValueError("news must contain between 10 and 5000 characters")
    source_name = str(payload.get("source_name", "")).strip()
    source_url = str(payload.get("source_url", "")).strip()
    if not source_name:
        raise ValueError("source_name is required")
    parsed_url = urlparse(source_url)
    if parsed_url.scheme not in {"http", "https"} or not parsed_url.netloc:
        raise ValueError("source_url must be a valid http or https URL")
    corroborating_sources = payload.get("corroborating_sources") or []
    if not isinstance(corroborating_sources, list) or len(corroborating_sources) > 10:
        raise ValueError("corroborating_sources must be a list with at most 10 items")
    for item in corroborating_sources:
        if not isinstance(item, dict) or not item.get("name") or not item.get("url"):
            raise ValueError("each corroborating source needs name and url")
        parsed = urlparse(str(item["url"]))
        if parsed.scheme not in {"http", "https"} or not parsed.netloc:
            raise ValueError("corroborating source URLs must use http or https")
    return news
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None


def verify_news(payload):
    news = validate_payload(payload)

    source = verify_source(payload.get("source_name"), payload.get("source_url"))
    corroborating_sources = payload.get("corroborating_sources") or []
    trusted_corroboration = [
        verify_source(item.get("name"), item.get("url"))
        for item in corroborating_sources
        if isinstance(item, dict)
    ]
    all_sources = [source] + trusted_corroboration
    unique_publishers = {
        item["publisher"].lower()
        for item in all_sources
        if item.get("publisher")
    }
    trusted_sources = [item for item in all_sources if item["trusted"]]
    location = detect_location(news)
    event = detect_event(news)
    rumour = predict_rumour_signal(news)

    result = {
        "status": "UNVERIFIED",
        "news": news,
        "source_verification": source,
        "corroboration": {
            "independent_publishers": len(unique_publishers),
            "trusted_publishers": len(trusted_sources),
            "sources": all_sources,
        },
        "location": location,
        "event": event,
        "rumour_prediction": rumour,
        "evidence": [],
    }

    if not source["trusted"]:
        result["evidence"].append("Primary publisher is not in the trusted source registry.")
    if len(unique_publishers) < 2:
        result["evidence"].append("Fewer than two independent publishers were supplied.")
    if not location:
        result["evidence"].append("A supported Indian city could not be detected.")
    if event == "unknown":
        result["evidence"].append("A supported weather event could not be detected.")

    if location and event != "unknown":
        latitude, longitude = CITY_COORDINATES[location]
        weather = get_live_weather(latitude, longitude)
        weather_supported, weather_reason = verify_weather(event, weather)
        result["weather_evidence"] = {
            "source": "Open-Meteo",
            "location": location,
            "latitude": latitude,
            "longitude": longitude,
            "temperature": weather["current"].get("temperature_2m"),
            "precipitation": weather["current"].get("precipitation"),
            "wind_speed": weather["current"].get("wind_speed_10m"),
            "wind_gust": weather["current"].get("wind_gusts_10m"),
            "observed_at": weather["current"].get("time"),
            "citation": "https://open-meteo.com/",
        }
        result["evidence"].append(weather_reason)
    else:
        weather_supported = False

    published_at_value = payload.get("published_at")
    published_at = parse_published_at(published_at_value)
    freshness_ok = True
    if published_at_value and not published_at:
        result["evidence"].append("published_at is not a valid ISO-8601 timestamp.")
        freshness_ok = False
    if published_at:
        age_hours = (datetime.now(timezone.utc) - published_at.astimezone(timezone.utc)).total_seconds() / 3600
        result["freshness_hours"] = round(max(0, age_hours), 2)
        if age_hours > 24:
            result["evidence"].append("Source publication is older than 24 hours.")
            freshness_ok = False
        if age_hours < -1:
            result["evidence"].append("Source publication time is in the future.")
            freshness_ok = False

    eligible = (
        source["trusted"]
        and len(unique_publishers) >= 2
        and location is not None
        and event != "unknown"
        and weather_supported
        and freshness_ok
    )
    if eligible:
        result["status"] = "VERIFIED_FOR_DISPLAY"
        result["evidence"].append("Trusted source, independent corroboration, and supporting live weather evidence passed.")
    else:
        result["evidence"].append("This report is withheld because all verification gates did not pass.")

    score = 0
    score += 25 if source["trusted"] else 0
    score += min(25, len(unique_publishers) * 12)
    score += 35 if weather_supported else 0
    score += 15 if location and event != "unknown" else 0
    result["authenticity_score"] = min(100, score) if eligible else 0
    result["confidence_basis"] = "Evidence-gate score, not a guarantee that every article statement is true."
    return result


app = Flask(__name__)
CORS(
    app,
    origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://younis06.github.io",
    ],
)


@app.get("/")
def home():
    return jsonify({"message": "SIH Weather AI Verification API is running", "version": "2.0"})


@app.get("/health")
def health():
    return jsonify({"status": "ok", "model_loaded": True})


@app.post("/verify")
def verify():
    data = request.get_json(silent=True) or {}
    try:
        return jsonify(verify_news(data))
    except ValueError as error:
        return jsonify({"error": str(error)}), 400
    except requests.RequestException as error:
        return jsonify({"error": "Live weather evidence could not be retrieved.", "details": str(error)}), 503


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
