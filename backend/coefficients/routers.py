from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from coefficients.repositories import CoefficientRepository, CoefficientTypeRepository
from coefficients.managers import BuildingCoefficientManager, BuildingCoefficientTypeManager
from coefficients.schemas import (AddCoefficientResponse, AddCoefficientBody, UpdateCoefficientBody,
                                  AddCoefficientTypeResponse, AddCoefficientTypeBody, UpdateCoefficientTypeBody)
from core.dependencies import get_db


router = APIRouter(prefix="/coefficients", tags=["Coefficients"])


@router.get("/", response_model=list[AddCoefficientResponse])
async def get_coefficient_list(db: AsyncSession = Depends(get_db)):
    coefficient_manager = BuildingCoefficientManager(db)
    return await coefficient_manager.get_coefficient_list()


@router.post("/add/", response_model=AddCoefficientResponse)
async def add_coefficient(create_coefficient: AddCoefficientBody, db: AsyncSession = Depends(get_db)):
    coefficient_manager = BuildingCoefficientManager(db)
    return await coefficient_manager.create_coefficient(**create_coefficient.model_dump())


@router.get("/{coefficient_id}/", response_model=AddCoefficientResponse)
async def get_coefficient(coefficient_id: int, db: AsyncSession = Depends(get_db)):
    coefficient_manager = BuildingCoefficientManager(db)
    return await coefficient_manager.get_coefficient(coefficient_id)


@router.put("/{coefficient_id}/", response_model=AddCoefficientResponse)
async def edit_coefficient(coefficient_id: int, update_coefficient: UpdateCoefficientBody, db: AsyncSession = Depends(get_db)):
    coefficient_manager = BuildingCoefficientManager(db)
    return await coefficient_manager.update_coefficient(coefficient_id, **update_coefficient.model_dump(exclude_unset=True))


@router.delete("/{coefficient_id}/")
async def delete_coefficient(coefficient_id: int, db: AsyncSession = Depends(get_db)):
    coefficient_manager = BuildingCoefficientManager(db)
    return await coefficient_manager.delete_coefficient(coefficient_id)

""" -------------------------------------------------------------------------------------------------- """

coefficient_types_router = APIRouter(prefix="/coefficient-types", tags=["Coefficient Types"])


@coefficient_types_router.get("/by-building-id/{building_id}/", response_model=dict[str, list[AddCoefficientTypeResponse]])
async def get_coefficient_types_by_building(building_id: int, db: AsyncSession = Depends(get_db)):
    coefficient_type_manager = BuildingCoefficientTypeManager(db)
    return await coefficient_type_manager.get_coefficient_types_by_building_id(building_id)


@coefficient_types_router.get("/", response_model=list[AddCoefficientTypeResponse])
async def get_coefficient_type_list(db: AsyncSession = Depends(get_db)):
    coefficient_type_manager = BuildingCoefficientTypeManager(db)
    return await coefficient_type_manager.get_coefficient_type_list()


@coefficient_types_router.post("/add/", response_model=AddCoefficientTypeResponse)
async def add_coefficient_type(create_coefficient_type: AddCoefficientTypeBody, db: AsyncSession = Depends(get_db)):
    coefficient_type_manager = BuildingCoefficientTypeManager(db)
    return await coefficient_type_manager.create_coefficient_type(**create_coefficient_type.model_dump())


@coefficient_types_router.get("/{coefficient_type_id}/", response_model=AddCoefficientTypeResponse)
async def get_coefficient_type(coefficient_type_id: int, db: AsyncSession = Depends(get_db)):
    coefficient_type_manager = BuildingCoefficientTypeManager(db)
    return await coefficient_type_manager.get_coefficient_type(coefficient_type_id)


@coefficient_types_router.patch("/{coefficient_type_id}/", response_model=AddCoefficientTypeResponse)
async def edit_coefficient_type(coefficient_type_id: int, update_coefficient_type: UpdateCoefficientTypeBody, db: AsyncSession = Depends(get_db)):
    coefficient_type_manager = BuildingCoefficientTypeManager(db)
    return await coefficient_type_manager.update_coefficient_type(coefficient_type_id, **update_coefficient_type.model_dump(exclude_unset=True))


@coefficient_types_router.delete("/{coefficient_type_id}/")
async def delete_coefficient_type(coefficient_id: int, db: AsyncSession = Depends(get_db)):
    coefficient_type_manager = BuildingCoefficientTypeManager(db)
    return await coefficient_type_manager.delete_coefficient_type(coefficient_id)





