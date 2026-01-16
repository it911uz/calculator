from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from apartments.models import Apartment
from apartments.validations import ApartmentValidator
from coefficients.models import BuildingCoefficientType
from core.repositories import BaseRepository


class ApartmentRepository(BaseRepository):
    def __init__(self, db: AsyncSession):
        super().__init__(db)
        self.apartment_validator = ApartmentValidator(db)

    async def get_apartment_list(self):
        response = await super().get_all(Apartment)
        for apartment in response:
            apartment.bct_ids = [i.id for i in apartment.building_coefficient_types]

        return response

    async def create_apartment(self, **kwargs):
        building_id = kwargs.get("building_id")
        await self.apartment_validator.validate_building_fk(building_id)

        bct_ids = kwargs.pop("btc_ids")
        new_apartment = Apartment(
            number=kwargs.get("number"),
            floor=kwargs.get("floor"),
            area=kwargs.get("area"),
            room_count=kwargs.get("room_count"),
            building_id=building_id,
        )

        if bct_ids:
            stmt = (
                select(BuildingCoefficientType)
                .where(BuildingCoefficientType.id.in_(bct_ids))
            )
            result = await self.db.execute(stmt)
            bcts = result.scalars().all()

            new_apartment.building_coefficient_types.extend(bcts)

        self.db.add(new_apartment)
        await self.db.commit()
        await self.db.refresh(new_apartment)

        new_apartment.bct_ids = bct_ids
        return new_apartment

    async def get_apartment(self, apartment_id: int):
        response = await super().get(Apartment, apartment_id)
        response.bct_ids = [i.id for i in response.building_coefficient_types]
        return response

    async def update_apartment(self, instance_id, **kwargs):
        btc_ids = kwargs.pop("btc_ids", None)
        instance = await self._get_instance_by_id(Apartment, instance_id)

        for key, value in kwargs.items():
            if hasattr(instance, key):
                setattr(instance, key, value)

        if btc_ids is not None:
            result = await self.db.execute(
                select(BuildingCoefficientType)
                .where(BuildingCoefficientType.id.in_(btc_ids))
            )
            btc_objects = result.scalars().all()

            instance.building_coefficient_types.clear()
            instance.building_coefficient_types.extend(btc_objects)


        await self.db.commit()
        await self.db.refresh(instance)

        instance.bct_ids = btc_ids
        return instance

    async def delete_apartment(self, apartment_id: int):
        return await super().delete(Apartment, apartment_id)





