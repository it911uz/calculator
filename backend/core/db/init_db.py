from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from sqlalchemy.dialects.postgresql import insert

from core.db.base_model import BaseModel
from permissions.models import Permission


async def init_permissions(db: AsyncSession):
    actions = ["create", "view", "update", "delete"]
    tables = BaseModel.metadata.tables.keys()

    values = []

    for table in tables:
        for action in actions:
            values.append(
                {
                    "codename": f"{action}_{table}",
                    "label": f"{action.title()} {table.lower()}",
                }
            )

    custom_permissions = [
        {
            "codename": "assign_permissions",
            "label": "Assign permissions",
        }
    ]

    values.extend(custom_permissions)

    if not values:
        return []

    stmt = insert(Permission).values(values)

    stmt = stmt.on_conflict_do_nothing(
        index_elements=["label"]
    )

    await db.execute(stmt)
    await db.commit()

    result = await db.execute(select(Permission))
    return result.scalars().all()







