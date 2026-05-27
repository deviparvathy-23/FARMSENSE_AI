import os
import json
import re
from typing import List
from groq import Groq
from dotenv import load_dotenv
from models.schemas import ChatMessage, ChatResponse

load_dotenv()
client = Groq(api_key=os.environ.get("GROQ_API_KEY", ""))

LANGUAGE_INSTRUCTIONS = {
    "english":   "Respond in simple, clear English.",
    "malayalam": "ഉത്തരം മലയാളത്തിൽ നൽകുക. Simple Malayalam.",
    "hindi":     "हिंदी में जवाब दें। सरल भाषा उपयोग करें।",
    "tamil":     "தமிழில் பதில் கொடுங்கள். எளிய தமிழ்.",
    "telugu":    "తెలుగులో సమాధానం ఇవ్వండి.",
    "kannada":   "ಕನ್ನಡದಲ್ಲಿ ಉತ್ತರಿಸಿ.",
    "bengali":   "বাংলায় উত্তর দিন।",
    "marathi":   "मराठीत उत्तर द्या.",
}

SYSTEM_PROMPT = """
You are FarmSense AI — a friendly, expert agricultural assistant for Indian farmers.
You have deep knowledge of:
- Crop diseases, pests, and their treatments
- Soil health, fertilizers (organic and chemical)
- Seasonal planting calendars for Indian crops
- Water management and irrigation techniques
- Government agricultural schemes (PM-KISAN, PMFBY, Kisan Credit Card, etc.)
- Weather patterns and climate-smart farming
- Market prices and post-harvest management

Rules:
1. Always be warm, respectful, and speak like a trusted friend who is also an expert
2. Give practical, actionable advice specific to Indian farming conditions
3. Keep answers concise — no long lectures unless farmer asks for details
4. If you don't know something specific (like real-time prices), say so honestly
5. Always end with 1 helpful follow-up suggestion or question
6. {language_instruction}

You MUST respond ONLY with a valid JSON object and absolutely nothing else.
No explanation before or after. No markdown. No code fences. Just raw JSON.
Use this exact structure:
{{"reply": "your answer here", "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]}}
"""

DEFAULT_SUGGESTIONS = [
    "How do I treat crop disease?",
    "What crops should I plant this season?",
    "Tell me about PM-KISAN scheme",
]

def extract_json(text: str) -> dict:
    """Try multiple strategies to extract JSON from model output."""
    # 1. Strip markdown fences
    text = re.sub(r"^```(?:json)?", "", text.strip()).strip()
    text = re.sub(r"```$", "", text).strip()

    # 2. Direct parse
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # 3. Find first {...} block
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass

    # 4. Fallback — treat entire text as the reply
    return {"reply": text, "suggestions": DEFAULT_SUGGESTIONS}


async def chat_with_farmer(
    message: str,
    language: str = "english",
    history: List[ChatMessage] = [],
) -> ChatResponse:
    lang_instruction = LANGUAGE_INSTRUCTIONS.get(language.lower(), LANGUAGE_INSTRUCTIONS["english"])
    system = SYSTEM_PROMPT.format(language_instruction=lang_instruction)

    messages = [{"role": "system", "content": system}]
    for msg in history[-8:]:
        role = "user" if msg.role == "user" else "assistant"
        messages.append({"role": role, "content": msg.content})
    messages.append({"role": "user", "content": message})

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            max_tokens=1000,
            temperature=0.7,
            response_format={"type": "json_object"},  # Force JSON mode
        )
        raw = response.choices[0].message.content.strip()
        data = extract_json(raw)

        return ChatResponse(
            reply=data.get("reply", raw),
            language=language,
            suggestions=data.get("suggestions", DEFAULT_SUGGESTIONS),
        )

    except Exception as e:
        print(f"Groq API error: {e}")
        return ChatResponse(
            reply="I'm having trouble right now. Please try again.",
            language=language,
            suggestions=DEFAULT_SUGGESTIONS,
        )