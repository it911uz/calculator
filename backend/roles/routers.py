from fastapi import APIRouter
from starlette import status

from roles.schemas import CreateRoleBody, CreateRoleResponse

api_router = APIRouter(prefix="/roles", tags=["Roles"])


@api_router.post("", response_model=CreateRoleResponse, status_code=status.HTTP_201_CREATED)
async def create_role(create_role_body: CreateRoleBody):
    pass

