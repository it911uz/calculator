from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from core.db.session import get_db
from users.managers import UserManager
from users.schemas import UserListResponse, UserCreateResponse, UserCreateBody, UserGetResponse, UserUpdateResponse, \
    UserUpdateBody

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/", response_model=list[UserListResponse])
async def get_user_list(db: AsyncSession = Depends(get_db)):
    user_manager = UserManager(db)
    return await user_manager.get_user_list()

@router.post("/create/", response_model=UserCreateResponse)
async def create_user(create_user_body: UserCreateBody, db: AsyncSession = Depends(get_db)):
    user_manager = UserManager(db)
    return await user_manager.create_user(**create_user_body.model_dump())

@router.get("/{user_id}", response_model=UserGetResponse)
async def get_user(user_id: int, db: AsyncSession = Depends(get_db)):
    user_manager = UserManager(db)
    return await user_manager.get_user(user_id)

@router.patch("/{user_id}", response_model=UserUpdateResponse)
async def update_user(user_id: int, update_user_body: UserUpdateBody, db: AsyncSession = Depends(get_db)):
    user_manager = UserManager(db)
    return await user_manager.update_user(user_id, **update_user_body.model_dump())

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: int, db: AsyncSession = Depends(get_db)):
    user_manager = UserManager(db)
    return await user_manager.delete_user(user_id)















