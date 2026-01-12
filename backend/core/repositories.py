from sqlalchemy.ext.asyncio import AsyncSession


class BaseRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, model, **kwargs):
        new_instance = model(**kwargs)

        self.db.add(new_instance)
        await self.db.commit()
        await self.db.refresh(new_instance)

        return new_instance























