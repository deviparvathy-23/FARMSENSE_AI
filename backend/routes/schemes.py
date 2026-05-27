from fastapi import APIRouter
from models.schemas import SchemeRequest, SchemesResponse
from services.schemes_service import find_schemes

router = APIRouter(prefix="/schemes", tags=["Government Schemes"])


@router.post("/find", response_model=SchemesResponse)
async def get_schemes(request: SchemeRequest):
    """
    Find eligible government schemes based on farmer profile.
    Input: state, land size, crop type, annual income.
    """
    return await find_schemes(request)


@router.get("/all")
async def get_all_schemes():
    """Return all available schemes in the database."""
    from services.schemes_service import SCHEMES_DB
    return {"schemes": SCHEMES_DB, "total": len(SCHEMES_DB)}
