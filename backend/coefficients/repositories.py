from fastapi import HTTPException
from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from buildings.models import Building


class CoefficientsRepository:
    def __init__(self, db: AsyncSession):
        self.db = db


    async def get_coefficients_by_building_id(self, building_id: int):
        building_instance = await self.db.get(Building, building_id)

        if not building_instance:
            raise HTTPException(status_code=404, detail="Building not found")

        response = {}
        for i in building_instance.building_coefficients:
            response[i.name] = i.building_coefficient_types

        return response


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













