from pydantic import BaseModel


class AddComplexBody(BaseModel):
    name: str
    description: str | None = None


class AddComplexResponse(BaseModel):
    id: int
    name: str
    description: str | None


class UpdateComplexBody(BaseModel):
    name: str | None = None
    description: str | None = None

