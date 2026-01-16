from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession


class BaseValidator:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def validate_foreign_key(self, model, foreign_key: int):
        result = await self.db.scalar(
            select(model.id).where(model.id == foreign_key)
        )
        if not result:
            raise HTTPException(status_code=404, detail=f"{model.__name__} с идентификатором {foreign_key} не найдена.")
