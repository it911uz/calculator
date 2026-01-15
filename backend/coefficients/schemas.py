from decimal import Decimal

from pydantic import BaseModel, Field


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




""" ---------------------------------------------- """


class AddBuildingCoefficientTypeResponse(BaseModel):
    id: int
    name: str
    rate: Decimal = Field(max_digits=20, decimal_places=2)
    coefficient_id: int


class AddBuildingCoefficientTypeBody(BaseModel):
    name: str
    rate: Decimal = Field(max_digits=20, decimal_places=2)
    coefficient_id: int


class UpdateBuildingCoefficientTypeBody(BaseModel):
    name: str | None = None
    rate: Decimal | None = Field(default=None, max_digits=20, decimal_places=2)
    coefficient_id: int | None = None

""" ----------------------------------------------------------- """



class GetCoefTypeByBuildingIdResponse(BaseModel):
    name: str

















