from fastapi import HTTPException
from sqlalchemy import select
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
        await self._validate_floor(building_id, floor)

        bct_ids = kwargs.get("bct_ids")
        if bct_ids:
            await self._validate_bct_ids(building_id, bct_ids)

    async def validate_apartment_update(self, **kwargs):
        building_id = kwargs.get('building_id')
        if building_id:
            await self.validate_building_fk(building_id)

        floor = kwargs.get('floor')
        if floor:
            await self._validate_floor(building_id, floor)

        bct_ids = kwargs.get("bct_ids")
        if bct_ids:
            await self._validate_bct_ids(kwargs.get("building_id"), bct_ids)

    async def _validate_bct_ids(self, building_id: int, bct_ids: list[int]):
        for bct_id in bct_ids:
            await self.validate_foreign_key(BuildingCoefficientType, bct_id)

        building_repository = BuildingRepository(self.db)
        building = await building_repository.get_building(building_id)

        actual_bct_ids = []
        for bc in building.building_coefficients:
            for bct in bc.building_coefficient_types:
                actual_bct_ids.append(bct.id)

        if not set(bct_ids).issubset(set(actual_bct_ids)):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Некоторые коэффициенты здания не относятся к данному зданию."
            )

        await self._validate_bct_ids_does_not_belong_to_the_same_bc(bct_ids)


    async def _validate_bct_ids_does_not_belong_to_the_same_bc(self, bct_ids: list[int]):
        bcts_stmt = await self.db.execute(
            select(BuildingCoefficientType)
            .where(BuildingCoefficientType.id.in_(bct_ids))
        )
        bcts = bcts_stmt.scalars().all()

        bc_ids = []
        for bct in bcts:
            bc_id = bct.building_coefficient.id
            if bc_id in bc_ids:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Для каждого коэффициента здания можно выбрать один тип коэффициента здания!")
            bc_ids.append(bct.building_coefficient.id)

    async def _validate_floor(self, building_id: int, floor: int):
        building_repository = BuildingRepository(self.db)
        building = await building_repository.get_building(building_id)
        floor_count = building.floor_count

        if floor > floor_count:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Расположение квартиры на этом этаже ({floor}) не может превышать количество этажей в здании ({floor_count})."
            )





