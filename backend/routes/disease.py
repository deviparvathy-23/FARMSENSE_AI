from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from services.disease_ai import analyze_crop_image
from database import save_scan

router = APIRouter(prefix="/disease", tags=["Disease Detection"])


@router.post("/analyze")
async def analyze_disease(
    file: UploadFile = File(...),
    farmer_id: str = Form(default="anonymous"),
):
    """
    Upload a crop/leaf image and get AI disease diagnosis.
    Accepts: JPEG, PNG, WebP
    Returns: Disease name, severity, treatments, prevention tips
    """
    if file.content_type not in ["image/jpeg", "image/png", "image/webp", "image/jpg"]:
        raise HTTPException(
            status_code=400,
            detail="Only JPEG, PNG, or WebP images are supported."
        )

    image_bytes = await file.read()

    if len(image_bytes) > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(status_code=400, detail="Image too large. Max 10MB.")

    result = await analyze_crop_image(image_bytes)

    # Save to Supabase (non-blocking)
    try:
        await save_scan(
            farmer_id=farmer_id,
            image_url=file.filename,
            disease=result.disease_name,
            confidence=result.confidence,
        )
    except Exception:
        pass  # Don't fail the request if DB save fails

    return result
