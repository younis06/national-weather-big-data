import unittest
from unittest.mock import patch

import app


class VerificationTests(unittest.TestCase):
    def setUp(self):
        self.base_payload = {
            "news": "Heavy rainfall is happening in Chennai right now.",
            "source_name": "The Hindu",
            "source_url": "https://www.thehindu.com/weather/example",
            "corroborating_sources": [
                {
                    "name": "Reuters",
                    "url": "https://www.reuters.com/world/india/weather-example",
                }
            ],
        }

    def test_untrusted_url_cannot_become_trusted_from_name_only(self):
        source = app.verify_source("The Hindu", "https://example.com/story")
        self.assertFalse(source["trusted"])

    def test_valid_evidence_can_pass_display_gate(self):
        weather = {
            "current": {
                "temperature_2m": 28,
                "precipitation": 4.2,
                "wind_speed_10m": 12,
                "wind_gusts_10m": 18,
                "time": "2026-09-24T15:00",
            }
        }
        with patch.object(app, "get_live_weather", return_value=weather):
            result = app.verify_news(self.base_payload)
        self.assertEqual(result["status"], "VERIFIED_FOR_DISPLAY")
        self.assertGreater(result["authenticity_score"], 0)
        self.assertEqual(result["corroboration"]["independent_publishers"], 2)

    def test_missing_source_is_rejected(self):
        with self.assertRaises(ValueError):
            app.verify_news({"news": "Heavy rainfall is happening in Chennai."})

    def test_old_story_is_withheld(self):
        payload = {**self.base_payload, "published_at": "2020-01-01T00:00:00Z"}
        weather = {"current": {"precipitation": 4.2}}
        with patch.object(app, "get_live_weather", return_value=weather):
            result = app.verify_news(payload)
        self.assertEqual(result["status"], "UNVERIFIED")
        self.assertEqual(result["authenticity_score"], 0)


if __name__ == "__main__":
    unittest.main()
