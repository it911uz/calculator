from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from core.db.session import get_db
from permissions.managers import PermissionManager
from permissions.schemas import PermissionCreateBody, PermissionCreateResponse, PermissionListResponse, PermissionGetResponse, PermissionUpdateResponse, \
    PermissionUpdateBody

router = APIRouter(prefix="/permissions", tags=["Permissions"])


@router.get("/", response_model=list[PermissionListResponse])
async def get_permission_list(db: AsyncSession = Depends(get_db)):
    permission_manager = PermissionManager(db)
    return await permission_manager.get_permission_list()

@router.post("/create/", response_model=PermissionCreateResponse)
async def create_permission(create_permission_body: PermissionCreateBody, db: AsyncSession = Depends(get_db)):
    permission_manager = PermissionManager(db)
    return await permission_manager.create_permission(**create_permission_body.model_dump())

@router.get("/{permission_id}", response_model=PermissionGetResponse)
async def get_permission(permission_id: int, db: AsyncSession = Depends(get_db)):
    permission_manager = PermissionManager(db)
    return await permission_manager.get_permission(permission_id)

@router.patch("/{permission_id}", response_model=PermissionUpdateResponse)
async def update_permission(permission_id: int, update_permission_body: PermissionUpdateBody, db: AsyncSession = Depends(get_db)):
    permission_manager = PermissionManager(db)
    return await permission_manager.update_permission(permission_id, **update_permission_body.model_dump())

@router.delete("/{permission_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_permission(permission_id: int, db: AsyncSession = Depends(get_db)):
    permission_manager = PermissionManager(db)
    return await permission_manager.delete_permission(permission_id)
