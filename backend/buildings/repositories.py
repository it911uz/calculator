from sqlalchemy.ext.asyncio import AsyncSession

from buildings.models import Building
from buildings.validations import BuildingValidator
from core.repositories import BaseRepository


class BuildingRepository(BaseRepository):
    def __init__(self, db: AsyncSession):
        super().__init__(db)
        self.building_validator = BuildingValidator(db)

    async def get_building_list(self):
        return await super().get_all(Building)

    async def create_building(self, **kwargs):
        await self.building_validator.validate_complex_fk(kwargs.get("complex_id"))
        return await super().create(Building, **kwargs)

    async def get_building(self, building_id: int):
        return await super().get(Building, building_id)

    async def update_building(self, building_id: int, **kwargs):
        await self.building_validator.validate_complex_fk(kwargs.get("complex_id"))
        return await super().update(Building, building_id, **kwargs)

    async def delete_building(self, building_id: int):
        return await super().delete(Building, building_id)
