from fastapi import HTTPException
from starlette import status

from buildings.models import Building
from coefficients.models import BuildingCoefficientType
from buildings.repositories import BuildingRepository
from core.validations import BaseValidator


class ApartmentValidator(BaseValidator):
    async def validate_apartment_create(self, **kwargs):
        building_id = kwargs.get('building_id')
        await self.validate_building_fk(building_id)

        floor = kwargs.get('floor')
        await self.validate_floor(building_id, floor)

        bct_ids = kwargs.get("bct_ids")
        if bct_ids:
            await self.validate_bct_ids(bct_ids)

    async def validate_apartment_update(self, **kwargs):
        building_id = kwargs.get('building_id')
        if building_id:
            await self.validate_building_fk(building_id)

        floor = kwargs.get('floor')
        if floor:
            await self.validate_floor(building_id, floor)

        bct_ids = kwargs.get("bct_ids")
        if bct_ids:
            await self.validate_bct_ids(bct_ids)


    async def validate_building_fk(self, fk):
        await self.validate_foreign_key(Building, fk)

    async def validate_floor(self, building_id: int, floor: int):
        building_repository = BuildingRepository(self.db)
        building = await building_repository.get_building(building_id)
        floor_count = building.floor_count

        if floor > floor_count:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Расположение квартиры на этом этаже ({floor}) не может превышать количество этажей в здании ({floor_count})."
            )

    async def validate_bct_ids(self, bct_ids: list[int]):
        for bct_id in bct_ids:
            await self.validate_foreign_key(BuildingCoefficientType, bct_id)





