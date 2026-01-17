from decimal import Decimal

from pydantic import BaseModel, Field, PositiveInt

from apartments.schema_validation_mixins import ApartmentSchemaValidationMixin


class AddApartmentResponse(BaseModel):
    id: int
    number: str
    floor: int
    area: Decimal = Field(max_digits=20, decimal_places=2)
    room_count: int
    final_price: Decimal = Field(max_digits=20, decimal_places=2)
    building_id: int

    bct_ids: list[int]


class AddApartmentBody(ApartmentSchemaValidationMixin):
    number: str
    floor: int
    area: Decimal = Field(max_digits=20, decimal_places=2)
    room_count: int
    building_id: int
    bct_ids: list[int]


class UpdateApartmentBody(ApartmentSchemaValidationMixin):
    number: str | None = None
    floor: int | None = None
    area: Decimal | None = Field(default=None, max_digits=20, decimal_places=2)
    room_count: int | None = None
    building_id: int | None = None
    bct_ids: list[int] | None = None





















