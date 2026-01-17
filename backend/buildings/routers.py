from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from buildings.managers import BuildingManager
from buildings.repositories import BuildingRepository
from buildings.schemas import AddBuildingResponse, AddBuildingBody, UpdateBuildingBody
from core.dependencies import get_db


router = APIRouter(prefix="/buildings", tags=["Buildings"])


@router.get("/", response_model=list[AddBuildingResponse])
async def get_building_list(db: AsyncSession = Depends(get_db)):
    building_manager = BuildingManager(db)
    return await building_manager.get_building_list()


@router.post("/add/", response_model=AddBuildingResponse)
async def add_building(create_complex: AddBuildingBody, db: AsyncSession = Depends(get_db)):
    building_manager = BuildingManager(db)
    return await building_manager.create_building(**create_complex.model_dump())


@router.get("/{building_id}/", response_model=AddBuildingResponse)
async def get_building(building_id: int, db: AsyncSession = Depends(get_db)):
    building_manager = BuildingManager(db)
    return await building_manager.get_building(building_id)


@router.put("/{building_id}/", response_model=AddBuildingResponse)
async def edit_building(building_id: int, update_building: UpdateBuildingBody, db: AsyncSession = Depends(get_db)):
    building_manager = BuildingManager(db)
    return await building_manager.update_building(building_id, **update_building.model_dump(exclude_unset=True))


@router.delete("/{building_id}/")
async def delete_building(building_id: int, db: AsyncSession = Depends(get_db)):
    building_manager = BuildingManager(db)
    return await building_manager.delete_building(building_id)





