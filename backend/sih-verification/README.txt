
SIH WEATHER AI VERIFICATION MODEL
==================================

Purpose:
This AI component verifies weather-related news reports
using a trained rumour classification model and live weather
evidence.

AI Model:
TF-IDF + Logistic Regression

Supporting Model:
PHEME rumour verification dataset

Live Weather Evidence:
Open-Meteo

Verification statuses:
1. VERIFIED
2. CONFLICTING
3. UNVERIFIED

Main files:
- app.py
- rumour_model_final.pkl
- tfidf_vectorizer_final.pkl
- ai_verification_config.pkl
- requirements.txt

API:
POST /verify

Example request:

{
    "news": "Heavy rainfall is happening in Chennai right now.",
    "source_name": "The Hindu",
    "source_url": "https://www.thehindu.com/weather/example",
    "published_at": "2026-09-24T15:00:00Z",
    "corroborating_sources": [
        {
            "name": "Reuters",
            "url": "https://www.reuters.com/world/india/weather-example"
        }
    ]
}

The API returns information such as:
- verification status
- detected location
- detected weather event
- explanation/reason
- rumour prediction
- rumour confidence
- weather evidence
- source identity and trusted-source basis
- independent publisher count
- citation links
- evidence checks
- authenticity score

Important:
The rumour model is a supporting signal and does not by itself
prove that a news report is true.

The current weather evidence is used to verify supported
weather-related claims. Claims such as floods, cyclones and
heatwaves require additional official evidence sources before
they can be conclusively verified.

Display rule:
A report is returned as VERIFIED_FOR_DISPLAY only when the
publisher is trusted, at least two independent publishers are
present, a supported city and event are detected, and current
weather evidence supports the claim. Otherwise the report is
returned as UNVERIFIED and should be withheld from public display.

Run locally on Windows:
1. python -m pip install -r requirements.txt
2. python app.py
3. POST JSON to http://127.0.0.1:5000/verify

Model compatibility:
The bundled scikit-learn model was saved with scikit-learn 1.6.1.
Use that version when reproducing the training environment if
predictions need to be compared exactly.
