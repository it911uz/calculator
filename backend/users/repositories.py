from sqlalchemy.ext.asyncio import AsyncSession

from auth.utils.services import PasswordService
from core.repositories import BaseRepository
from users.models import User


class UserRepository(BaseRepository):
    def __init__(self, db: AsyncSession):
        super().__init__(db)
        self.password_service = PasswordService()

    async def get_user_list(self):
        return await self.get_all(User)

    async def create_user(self, **kwargs):
        kwargs["hashed_password"] = self.password_service.hash_password(kwargs.pop('password'))
        return await self.create(User, **kwargs)

    async def get_user(self, user_id: int):
        return await self.get(User, user_id)

    async def update_user(self, user_id: int, **kwargs):
        return await self.update(User, user_id, **kwargs)

    async def delete_user(self, user_id: int):
        return await self.delete(User, user_id)









