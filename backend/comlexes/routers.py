from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from comlexes.repositories import ComplexRepository
from comlexes.schemas import AddComplexResponse, AddComplexBody
from core.dependencies import get_db

router = APIRouter(prefix="/complexes", tags=["Complexes"])




@router.post("/add_complex/", response_model=AddComplexResponse)
async def add_complex(create_complex: AddComplexBody, db: AsyncSession = Depends(get_db)):
    complex_repo = ComplexRepository(db)
    return await complex_repo.create_complex(**create_complex.model_dump())






