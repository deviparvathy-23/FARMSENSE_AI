from pydantic import BaseModel
from typing import Optional, List

# ── Disease Scanner ──────────────────────────────────────
class DiseaseResult(BaseModel):
    disease_name: str
    confidence: float
    severity: str                  # Low / Medium / High
    description: str
    organic_treatment: List[str]
    chemical_treatment: List[str]
    prevention_tips: List[str]
    is_healthy: bool

# ── Chat ────────────────────────────────────────────────
class ChatMessage(BaseModel):
    role: str                      # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str
    language: str = "english"      # malayalam, hindi, tamil, telugu…
    history: List[ChatMessage] = []

class ChatResponse(BaseModel):
    reply: str
    language: str
    suggestions: List[str] = []    # quick-reply chips

# ── Weather ─────────────────────────────────────────────
class WeatherData(BaseModel):
    location: str
    temperature: float
    feels_like: float
    humidity: int
    description: str
    wind_speed: float
    forecast: List[dict]

class WeatherAdvice(BaseModel):
    weather: WeatherData
    farming_advice: str
    sowing_suitable: bool
    irrigation_needed: bool
    alerts: List[str] = []

# ── Schemes ─────────────────────────────────────────────
class SchemeRequest(BaseModel):
    state: str
    land_acres: float
    crop_type: str
    annual_income: Optional[float] = None

class Scheme(BaseModel):
    name: str
    ministry: str
    benefit: str
    eligibility: str
    how_to_apply: str
    link: str

class SchemesResponse(BaseModel):
    schemes: List[Scheme]
    total_found: int
    message: str
