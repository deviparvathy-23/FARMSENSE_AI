from fastapi import APIRouter, HTTPException, Query
from services.weather_service import get_weather_and_advice

router = APIRouter(prefix="/weather", tags=["Weather Advisory"])


@router.get("/advice")
async def weather_advice(
    lat: float = Query(..., description="Latitude of farm location"),
    lon: float = Query(..., description="Longitude of farm location"),
    crop: str = Query(default="general", description="Crop type being grown"),
):
    """
    Get current weather + AI-powered farming advice for your location.
    Pass GPS coordinates (lat, lon) and your crop type.
    """
    if not (-90 <= lat <= 90) or not (-180 <= lon <= 180):
        raise HTTPException(status_code=400, detail="Invalid coordinates.")

    result = await get_weather_and_advice(lat=lat, lon=lon, crop=crop)
    return result
