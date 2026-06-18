from sqlalchemy import func, select

from buildings.models import Building
from complexes.models import Complex
from core.repositories import BaseRepository


class ComplexRepository(BaseRepository):
    async def get_complex_list(self, filters):
        buildings_subq = (
            select(func.count(Building.id))
            .where(Building.complex_id == Complex.id)
            .scalar_subquery()
        )
        stmt = select(Complex, buildings_subq.label("buildings_count"))
        if filters is not None:
            stmt = filters.filter(stmt)

        result = await self.db.execute(stmt)
        rows = result.all()

        return [
            {
                "id": row.Complex.id,
                "name": row.Complex.name,
                "description": row.Complex.description,
                "logo_url": row.Complex.logo_url,
                "buildings_count": row.buildings_count,
            }
            for row in rows
        ]

    async def create_complex(self, **kwargs):
        return await self.create(Complex, **kwargs)

    async def get_complex(self, complex_id: int):
        return await self.get(Complex, complex_id)

    async def update_complex(self, complex_id: int, **kwargs):
        return await self.update(Complex, complex_id, **kwargs)

    async def delete_complex(self, complex_id: int):
        return await self.delete(Complex, complex_id)
