import core.models

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.routers import routers
from core.config import origins

from lifespan import lifespan

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


for router in routers:
    app.include_router(router)
