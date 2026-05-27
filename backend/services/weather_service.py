import os
import httpx
import json
import re
from google import genai
from google.genai import types
from dotenv import load_dotenv
from models.schemas import WeatherData, WeatherAdvice

load_dotenv()
client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY", ""))

OPEN_METEO_BASE = "https://api.open-meteo.com/v1/forecast"
GEOCODE_BASE    = "https://nominatim.openstreetmap.org/reverse"


async def get_weather_and_advice(lat: float, lon: float, crop: str = "general") -> WeatherAdvice:
    """
    Fetch weather from Open-Meteo (free, no key) and generate AI farming advice.
    """
    async with httpx.AsyncClient(timeout=10) as http:

        # Get location name from coordinates (free, no key)
        geo_resp = await http.get(
            GEOCODE_BASE,
            params={"lat": lat, "lon": lon, "format": "json"},
            headers={"User-Agent": "FarmSenseAI/1.0"},
        )
        location_name = "Your Location"
        if geo_resp.status_code == 200:
            geo = geo_resp.json()
            addr = geo.get("address", {})
            location_name = (
                addr.get("village")
                or addr.get("town")
                or addr.get("city")
                or addr.get("state")
                or "Your Location"
            )

        # Get weather from Open-Meteo
        weather_resp = await http.get(
            OPEN_METEO_BASE,
            params={
                "latitude": lat,
                "longitude": lon,
                "current": "temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,precipitation,weather_code",
                "hourly": "temperature_2m,relative_humidity_2m,precipitation_probability",
                "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code",
                "timezone": "Asia/Kolkata",
                "forecast_days": 3,
            },
        )
        weather_resp.raise_for_status()
        w = weather_resp.json()

    current   = w["current"]
    daily     = w["daily"]
    hourly    = w["hourly"]

    temp        = current["temperature_2m"]
    feels_like  = current["apparent_temperature"]
    humidity    = current["relative_humidity_2m"]
    wind_speed  = current["wind_speed_10m"]
    precip      = current["precipitation"]
    description = weather_code_to_description(current["weather_code"])

    # Build 5-point forecast from hourly data
    forecast = [
        {
            "time": hourly["time"][i],
            "temp": hourly["temperature_2m"][i],
            "description": f"Humidity {hourly['relative_humidity_2m'][i]}%",
            "humidity": hourly["relative_humidity_2m"][i],
        }
        for i in range(0, min(5, len(hourly["time"])))
    ]

    weather = WeatherData(
        location=location_name,
        temperature=temp,
        feels_like=feels_like,
        humidity=humidity,
        description=description,
        wind_speed=wind_speed,
        forecast=forecast,
    )

    # Generate farming advice using Gemini
    advice_prompt = f"""
You are a smart farming weather advisor for Indian farmers.

Current weather at {weather.location}:
- Temperature: {weather.temperature}°C (feels like {weather.feels_like}°C)
- Humidity: {weather.humidity}%
- Condition: {weather.description}
- Wind Speed: {weather.wind_speed} m/s
- Precipitation: {precip} mm
- 3-day max temps: {daily['temperature_2m_max']}
- 3-day rainfall: {daily['precipitation_sum']} mm
- Crop: {crop}

Based on this, give concise farming advice. Respond ONLY as JSON:
{{
  "farming_advice": "2-3 sentences of specific practical advice for today",
  "sowing_suitable": true/false,
  "irrigation_needed": true/false,
  "alerts": ["any warnings like pest risk, frost, heavy rain etc"]
}}
"""

    try:
        ai_resp = client.models.generate_content(
            model="gemini-2.5-flash-native-audio-latest",
            contents=advice_prompt,
            config=types.GenerateContentConfig(
                max_output_tokens=500,
                temperature=0.5,
            ),
        )
        raw = ai_resp.text.strip()
        raw = re.sub(r"^```(?:json)?", "", raw).strip()
        raw = re.sub(r"```$", "", raw).strip()
        advice_data = json.loads(raw)

    except Exception as e:
        print(f"Gemini weather advice error: {e}")
        advice_data = {
            "farming_advice": f"Current temperature is {temp}°C with {humidity}% humidity. {description}. Plan your farming activities accordingly.",
            "sowing_suitable": 40 <= humidity <= 80 and 15 <= temp <= 35,
            "irrigation_needed": humidity < 40 or precip < 1,
            "alerts": ["Heavy rain expected" if precip > 10 else "Check local conditions"],
        }

    return WeatherAdvice(
        weather=weather,
        farming_advice=advice_data.get("farming_advice", ""),
        sowing_suitable=advice_data.get("sowing_suitable", False),
        irrigation_needed=advice_data.get("irrigation_needed", False),
        alerts=advice_data.get("alerts", []),
    )


def weather_code_to_description(code: int) -> str:
    """Convert WMO weather code to human-readable description."""
    codes = {
        0: "Clear Sky", 1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
        45: "Foggy", 48: "Icy Fog",
        51: "Light Drizzle", 53: "Moderate Drizzle", 55: "Dense Drizzle",
        61: "Slight Rain", 63: "Moderate Rain", 65: "Heavy Rain",
        71: "Slight Snowfall", 73: "Moderate Snowfall", 75: "Heavy Snowfall",
        80: "Slight Showers", 81: "Moderate Showers", 82: "Violent Showers",
        95: "Thunderstorm", 96: "Thunderstorm with Hail", 99: "Heavy Thunderstorm",
    }
    return codes.get(code, "Variable Conditions")