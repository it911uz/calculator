from sqlalchemy.ext.asyncio import AsyncSession

from apartments.repositories import ApartmentRepository
from apartments.validations import ApartmentValidator


class ApartmentManager:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.apartment_repository = ApartmentRepository(db)
        self.apartment_validator = ApartmentValidator(db)

    async def get_apartment_list(self):
        return await self.apartment_repository.get_apartment_list()

    async def create_apartment(self, **kwargs):
        # FIELDS VALIDATIONS
        await self.apartment_validator.validate_apartment_create(**kwargs)

        return await self.apartment_repository.create_apartment(**kwargs)

    async def get_apartment(self, apartment_id: int):
        return await self.apartment_repository.get_apartment(apartment_id)

    async def update_apartment(self, apartment_id, **kwargs):
        # FIELDS VALIDATIONS
        await self.apartment_validator.validate_apartment_update(**kwargs)

        return await self.apartment_repository.update_apartment(apartment_id, **kwargs)

    async def delete_apartment(self, apartment_id: int):
        return await self.apartment_repository.delete_apartment(apartment_id)








