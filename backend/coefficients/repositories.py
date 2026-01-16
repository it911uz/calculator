from fastapi import HTTPException

from buildings.models import Building
from coefficients.models import BuildingCoefficient, BuildingCoefficientType
from core.repositories import BaseRepository


class CoefficientRepository(BaseRepository):
    async def get_coefficient_list(self):
        return await super().get_all(BuildingCoefficient)

    async def create_coefficient(self, **kwargs):
        return await super().create(BuildingCoefficient, **kwargs)

    async def get_coefficient(self, coefficient_id: int):
        return await super().get(BuildingCoefficient, coefficient_id)

    async def update_coefficient(self, coefficient_id: int, **kwargs):
        return await super().update(BuildingCoefficient, coefficient_id, **kwargs)

    async def delete_coefficient(self, coefficient_id: int):
        return await super().delete(BuildingCoefficient, coefficient_id)


class CoefficientTypeRepository(BaseRepository):
    async def get_coefficient_types_by_building_id(self, building_id: int):
        building_instance = await self.db.get(Building, building_id)

        if not building_instance:
            raise HTTPException(status_code=404, detail="Building not found")

        response = {}
        for i in building_instance.building_coefficients:
            response[i.name] = i.building_coefficient_types

        return response

    async def get_coefficient_type_list(self):
        return await super().get_all(BuildingCoefficientType)

    async def create_coefficient_type(self, **kwargs):
        return await super().create(BuildingCoefficientType, **kwargs)

    async def get_coefficient_type(self, coefficient_type_id: int):
        return await super().get(BuildingCoefficientType, coefficient_type_id)

    async def update_coefficient_type(self, coefficient_type_id: int, **kwargs):
        return await super().update(BuildingCoefficientType, coefficient_type_id, **kwargs)

    async def delete_coefficient_type(self, coefficient_type_id: int):
        return await super().delete(BuildingCoefficientType, coefficient_type_id)

"""

{
    'bc1': [
        {
            'id': 4, 
            'name': 'bct1', 
            'rate': Decimal('5.00')
        },
        {
            'id': 5, 
            'name': 'bct2', 
            'rate': Decimal('15.00')
        }
    ],
    'bc2': [
        {
            'id': 5, 
            'name': 'bct3', 
            'rate': Decimal('5.00')
        },
        {
            'id': 6, 
            'name': 'bct4', 
            'rate': Decimal('15.00')
        }
    ]    
}


"""













