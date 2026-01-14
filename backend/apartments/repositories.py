from fastapi import HTTPException
from sqlalchemy import select

from apartments.models import Apartment
from coefficients.models import BuildingCoefficientType
from core.repositories import BaseRepository


class ApartmentRepository(BaseRepository):
    async def create(self, **kwargs):
        new_apartment = Apartment(
            number=kwargs.get("number"),
            floor=kwargs.get("floor"),
            area=kwargs.get("area"),
            room_count=kwargs.get("room_count"),
            final_price=kwargs.get("final_price"),
            building_id=kwargs.get("building_id"),
        )
        self.db.add(new_apartment)
        await self.db.flush()

        coefficient_type_ids = kwargs.get("coefficient_type_ids")

        if coefficient_type_ids:
            stmt = (
                select(BuildingCoefficientType)
                .where(BuildingCoefficientType.id.in_(coefficient_type_ids))
            )
            result = await self.db.execute(stmt)
            coefficients = result.scalars().all()

            # if len(coefficients) != len(coefficient_type_ids):
            #     raise HTTPException(
            #         status_code=400,
            #         detail="One or more coefficient types not found",
            #     )

            new_apartment.building_coefficient_types.extend(coefficients)


        await self.db.commit()
        return new_apartment






