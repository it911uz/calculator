from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from buildings.image_sevices import save_image, delete_image
from buildings.repositories import BuildingRepository
from buildings.validations import BuildingValidator
from core.config import BASE_URL


class BuildingManager:
    def __init__(self, db: AsyncSession):
        self.building_repository = BuildingRepository(db)
        self.building_validator = BuildingValidator(db)

    async def get_building_list(self, filters):
        return await self.building_repository.get_building_list(filters)

    async def create_building(self, **kwargs):
        await self.building_validator.validate_complex_fk(kwargs.get("complex_id"))
        return await self.building_repository.create_building(**kwargs)

    async def get_building(self, building_id: int):
        return await self.building_repository.get_building(building_id)

    async def update_building(self, building_id: int, **kwargs):
        await self.building_validator.validate_complex_fk(kwargs.get("complex_id"))
        return await self.building_repository.update_building(building_id, **kwargs)

    async def delete_building(self, building_id: int):
        return await self.building_repository.delete_building(building_id)

    async def update_building_image(self, building_id: int, image: UploadFile):
        await self.building_validator.validate_image(image)
        building = await self.building_repository.get_building(building_id)
        if building.image_url is not None:
            await delete_image(building.image_url)

        image_url = await save_image(image)
        image_url = BASE_URL + "images/" + image_url
        await self.building_repository.update_building(building_id, image_url=image_url)























