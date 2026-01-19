from sqlalchemy.ext.asyncio import AsyncSession

from users.repositories import UserRepository


class UserManager:
    def __init__(self, db: AsyncSession):
        self.user_repository = UserRepository(db)

    async def get_user_list(self):
        return await self.user_repository.get_user_list()

    async def create_user(self, **kwargs):
        return await self.user_repository.create_user(**kwargs)

    async def get_user(self, user_id: int):
        return await self.user_repository.get_user(user_id)

    async def update_user(self, user_id: int, **kwargs):
        return await self.user_repository.update_user(user_id, **kwargs)

    async def delete_user(self, user_id: int):
        return await self.user_repository.delete_user(user_id)








