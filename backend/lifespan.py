from contextlib import asynccontextmanager

from fastapi import FastAPI

from core.db.init_db import init_permissions
from core.db.session import async_session


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with async_session() as db:
        await init_permissions(db)
    yield












