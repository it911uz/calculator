from pydantic import BaseModel


class AddBuildingCoefficientResponse(BaseModel):
    id: int
    name: str
    building_id: int


class AddBuildingCoefficientBody(BaseModel):
    name: str
    building_id: int


class UpdateBuildingCoefficientBody(BaseModel):
    name: str | None = None
    building_id: int | None = None




















