from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status


class BaseValidator:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def validate_foreign_key(self, model, foreign_key: int):
        if foreign_key <= 0:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="FK не может быть отрицательным.")

        result = await self.db.scalar(select(model.id).where(model.id == foreign_key))
        if not result:
            raise HTTPException(status_code=404, detail=f"{model.__name__} с идентификатором {foreign_key} не найдена.")
