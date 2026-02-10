from complexes.models import Complex
from core.repositories import BaseRepository


class ComplexRepository(BaseRepository):
    async def get_complex_list(self, filters):
        return await self.get_all(Complex, filters)

    async def create_complex(self, **kwargs):
        return await self.create(Complex, **kwargs)

    async def get_complex(self, complex_id: int):
        return await self.get(Complex, complex_id)

    async def update_complex(self, complex_id: int, **kwargs):
        return await self.update(Complex, complex_id, **kwargs)

    async def delete_complex(self, complex_id: int):
        return await self.delete(Complex, complex_id)










