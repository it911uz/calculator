from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.db.base_model import BaseModel
from permissions.models import Permission


async def init_permissions(db: AsyncSession):
    actions = ["create", "view", "update", "delete"]

    existing_permission_codenames = (await db.execute(select(Permission.codename))).scalars().all()

    tables = BaseModel.metadata.tables.keys()

    print(BaseModel.metadata.tables.keys())
    permissions = []
    for table in tables:
        for action in actions:
            codename = f"{action}_{table}"
            if codename not in existing_permission_codenames:
                permissions.append(Permission(codename=codename))

    custom_permission_codenames = [
        "assign_permissions"
    ]
    for codename in custom_permission_codenames:
        if codename not in existing_permission_codenames:
            permissions.append(Permission(codename=codename))

    if permissions:
        db.add_all(permissions)
        await db.commit()

    return permissions







