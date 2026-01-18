from complexes.models import Complex
from core.repositories import BaseRepository


class ComplexRepository(BaseRepository):
    async def get_complex_list(self):
        return await super().get_all(Complex)

    async def create_complex(self, **kwargs):
        return await super().create(Complex, **kwargs)

    async def get_complex(self, complex_id: int):
        return await super().get(Complex, complex_id)

    async def update_complex(self, complex_id: int, **kwargs):
        return await super().update(Complex, complex_id, **kwargs)

    async def delete_complex(self, complex_id: int):
        return await super().delete(Complex, complex_id)










