from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from apartments.managers import ApartmentManager
from apartments.repositories import ApartmentRepository
from core.repositories import BaseRepository
from apartments.models import Apartment
from apartments.schemas import AddApartmentResponse, AddApartmentBody, UpdateApartmentBody
from core.dependencies import get_db


router = APIRouter(prefix="/apartments", tags=["Apartments"])


@router.get("/", response_model=list[AddApartmentResponse])
async def get_apartment_list(db: AsyncSession = Depends(get_db)):
    apartment_manager = ApartmentManager(db)
    return await apartment_manager.get_apartment_list()


@router.post("/add/", response_model=AddApartmentResponse)
async def add_apartment(create_apartment: AddApartmentBody, db: AsyncSession = Depends(get_db)):
    apartment_manager = ApartmentManager(db)
    return await apartment_manager.create_apartment(**create_apartment.model_dump())


@router.get("/{apartment_id}/", response_model=AddApartmentResponse)
async def get_apartment(apartment_id: int, db: AsyncSession = Depends(get_db)):
    apartment_manager = ApartmentManager(db)
    return await apartment_manager.get_apartment(apartment_id)


@router.put("/{apartment_id}/", response_model=AddApartmentResponse)
async def edit_apartment(apartment_id: int, update_apartment: UpdateApartmentBody, db: AsyncSession = Depends(get_db)):
    apartment_manager = ApartmentManager(db)
    return await apartment_manager.update_apartment(apartment_id, **update_apartment.model_dump())


@router.delete("/{apartment_id}/")
async def delete_apartment(apartment_id: int, db: AsyncSession = Depends(get_db)):
    apartment_manager = ApartmentManager(db)
    return await apartment_manager.delete_apartment(apartment_id)





