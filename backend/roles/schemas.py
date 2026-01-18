from pydantic import BaseModel

" ---------------------------------------------- "
class CreateRoleBody(BaseModel):
    name: str
    permissions: list[int] | None = None

class CreateRoleResponse(BaseModel):
    id: int
    name: str
    permissions: list[int]
" ---------------------------------------------- "



