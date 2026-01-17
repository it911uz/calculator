from sqlalchemy.ext.asyncio import AsyncSession

from buildings.models import Building
from buildings.validations import BuildingValidator
from core.repositories import BaseRepository


class BuildingRepository(BaseRepository):
    async def get_building_list(self):
        return await super().get_all(Building)

    async def create_building(self, **kwargs):
        return await super().create(Building, **kwargs)

    async def get_building(self, building_id: int):
        return await super().get(Building, building_id)

    async def update_building(self, building_id: int, **kwargs):
        return await super().update(Building, building_id, **kwargs)

    async def delete_building(self, building_id: int):
        return await super().delete(Building, building_id)
