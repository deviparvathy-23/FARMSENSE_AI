from fastapi import APIRouter, HTTPException
from models.schemas import ChatRequest, ChatResponse
from services.chat_ai import chat_with_farmer

router = APIRouter(prefix="/chat", tags=["AI Chatbot"])

SUPPORTED_LANGUAGES = [
    "english", "malayalam", "hindi", "tamil",
    "telugu", "kannada", "bengali", "marathi"
]


@router.post("/message", response_model=ChatResponse)
async def send_message(request: ChatRequest):
    """
    Send a farming question and get AI response.
    Supports 8 Indian languages.
    Maintains multi-turn conversation history.
    """
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    language = request.language.lower()
    if language not in SUPPORTED_LANGUAGES:
        language = "english"

    response = await chat_with_farmer(
        message=request.message,
        language=language,
        history=request.history,
    )
    return response


@router.get("/languages")
async def get_supported_languages():
    """Returns list of supported languages."""
    return {
        "languages": [
            {"code": "english",   "label": "English",   "native": "English"},
            {"code": "malayalam", "label": "Malayalam",  "native": "മലയാളം"},
            {"code": "hindi",     "label": "Hindi",      "native": "हिंदी"},
            {"code": "tamil",     "label": "Tamil",      "native": "தமிழ்"},
            {"code": "telugu",    "label": "Telugu",     "native": "తెలుగు"},
            {"code": "kannada",   "label": "Kannada",    "native": "ಕನ್ನಡ"},
            {"code": "bengali",   "label": "Bengali",    "native": "বাংলা"},
            {"code": "marathi",   "label": "Marathi",    "native": "मराठी"},
        ]
    }
