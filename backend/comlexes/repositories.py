from core.repositories import BaseRepository
from .models import Complex


class ComplexRepository(BaseRepository):
    async def create_complex(self, **kwargs):
        return await self.create(Complex, **kwargs)





















