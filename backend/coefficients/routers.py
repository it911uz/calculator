from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from core.repositories import BaseRepository
from coefficients.models import BuildingCoefficient, BuildingCoefficientType
from coefficients.schemas import (AddBuildingCoefficientResponse, AddBuildingCoefficientBody, UpdateBuildingCoefficientBody,
                                  AddBuildingCoefficientTypeResponse, AddBuildingCoefficientTypeBody, UpdateBuildingCoefficientTypeBody)
from core.dependencies import get_db


router = APIRouter(prefix="/coefficients", tags=["Coefficients"])


@router.get("/", response_model=list[AddBuildingCoefficientResponse])
async def get_coefficient_list(db: AsyncSession = Depends(get_db)):
    base_repo = BaseRepository(db)
    return await base_repo.get_all(BuildingCoefficient)


@router.post("/add/", response_model=AddBuildingCoefficientResponse)
async def add_coefficient(create_coefficient: AddBuildingCoefficientBody, db: AsyncSession = Depends(get_db)):
    base_repo = BaseRepository(db)
    return await base_repo.create(BuildingCoefficient, **create_coefficient.model_dump())


@router.get("/{coefficient_id}/", response_model=AddBuildingCoefficientResponse)
async def get_coefficient(coefficient_id: int, db: AsyncSession = Depends(get_db)):
    base_repo = BaseRepository(db)
    return await base_repo.get(BuildingCoefficient, coefficient_id)


@router.put("/{coefficient_id}/", response_model=AddBuildingCoefficientResponse)
async def edit_coefficient(coefficient_id: int, update_coefficient: UpdateBuildingCoefficientBody, db: AsyncSession = Depends(get_db)):
    base_repo = BaseRepository(db)
    return await base_repo.update(BuildingCoefficient, coefficient_id, **update_coefficient.model_dump(exclude_unset=True))


@router.delete("/{coefficient_id}/")
async def delete_coefficient(coefficient_id: int, db: AsyncSession = Depends(get_db)):
    base_repo = BaseRepository(db)
    return await base_repo.delete(BuildingCoefficient, coefficient_id)



coefficient_types_router = APIRouter(prefix="/coefficient-types", tags=["Coefficient Types"])

@coefficient_types_router.get("/", response_model=list[AddBuildingCoefficientTypeResponse])
async def get_coefficient_type_list(db: AsyncSession = Depends(get_db)):
    base_repo = BaseRepository(db)
    return await base_repo.get_all(BuildingCoefficientType)


@coefficient_types_router.post("/add/", response_model=AddBuildingCoefficientTypeResponse)
async def add_coefficient_type(create_coefficient_type: AddBuildingCoefficientTypeBody, db: AsyncSession = Depends(get_db)):
    base_repo = BaseRepository(db)
    return await base_repo.create(BuildingCoefficientType, **create_coefficient_type.model_dump())


@coefficient_types_router.get("/{coefficient_type_id}/", response_model=AddBuildingCoefficientTypeResponse)
async def get_coefficient_type(coefficient_type_id: int, db: AsyncSession = Depends(get_db)):
    base_repo = BaseRepository(db)
    return await base_repo.get(BuildingCoefficientType, coefficient_type_id)


@coefficient_types_router.put("/{coefficient_type_id}/", response_model=AddBuildingCoefficientTypeResponse)
async def edit_coefficient_type(coefficient_type_id: int, update_coefficient_type: UpdateBuildingCoefficientTypeBody, db: AsyncSession = Depends(get_db)):
    base_repo = BaseRepository(db)
    return await base_repo.update(BuildingCoefficientType, coefficient_type_id, **update_coefficient_type.model_dump(exclude_unset=True))


@coefficient_types_router.delete("/{coefficient_type_id}/")
async def delete_coefficient_type(coefficient_id: int, db: AsyncSession = Depends(get_db)):
    base_repo = BaseRepository(db)
    return await base_repo.delete(BuildingCoefficientType, coefficient_id)





