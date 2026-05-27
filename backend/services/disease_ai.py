import os
import base64
import json
import re
from PIL import Image
import io
from groq import Groq
from dotenv import load_dotenv
from models.schemas import DiseaseResult

load_dotenv()
client = Groq(api_key=os.environ.get("GROQ_API_KEY", ""))

DISEASE_PROMPT = """
You are an expert agricultural plant pathologist AI.
Analyze this crop/leaf image carefully and respond ONLY with a valid JSON object.

Identify:
1. Whether the plant is healthy or diseased
2. The exact disease name (if diseased)
3. Confidence level (0.0 to 1.0)
4. Severity (Healthy / Low / Medium / High)
5. A brief plain-language description
6. 3 organic treatment methods
7. 3 chemical treatment methods (with generic compound names)
8. 3 prevention tips

Respond ONLY with this exact JSON structure, no extra text:
{
  "is_healthy": true,
  "disease_name": "Disease Name or Healthy Plant",
  "confidence": 0.92,
  "severity": "Medium",
  "description": "Brief description of what you see",
  "organic_treatment": ["tip1", "tip2", "tip3"],
  "chemical_treatment": ["tip1", "tip2", "tip3"],
  "prevention_tips": ["tip1", "tip2", "tip3"]
}
"""


async def analyze_crop_image(image_bytes: bytes) -> DiseaseResult:
    try:
        # Resize image if too large
        img = Image.open(io.BytesIO(image_bytes))
        img.thumbnail((1024, 1024), Image.LANCZOS)
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=85)
        image_bytes = buf.getvalue()

        # Encode image to base64
        image_b64 = base64.b64encode(image_bytes).decode("utf-8")

        response = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_b64}",
                            },
                        },
                        {
                            "type": "text",
                            "text": DISEASE_PROMPT,
                        },
                    ],
                }
            ],
            max_tokens=1000,
        )

        raw = response.choices[0].message.content.strip()
        raw = re.sub(r"^```(?:json)?", "", raw).strip()
        raw = re.sub(r"```$", "", raw).strip()

        data = json.loads(raw)
        return DiseaseResult(
            disease_name=data.get("disease_name", "Unknown"),
            confidence=float(data.get("confidence", 0.0)),
            severity=data.get("severity", "Unknown"),
            description=data.get("description", ""),
            organic_treatment=data.get("organic_treatment", []),
            chemical_treatment=data.get("chemical_treatment", []),
            prevention_tips=data.get("prevention_tips", []),
            is_healthy=data.get("is_healthy", False),
        )

    except json.JSONDecodeError:
        return DiseaseResult(
            disease_name="Analysis Error",
            confidence=0.0,
            severity="Unknown",
            description="Could not parse AI response. Please try with a clearer image.",
            organic_treatment=[],
            chemical_treatment=[],
            prevention_tips=["Ensure good lighting", "Keep the leaf in focus", "Avoid blurry photos"],
            is_healthy=False,
        )
    except Exception as e:
        raise RuntimeError(f"Disease analysis failed: {str(e)}")