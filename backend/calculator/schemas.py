from datetime import date
from decimal import Decimal

from pydantic import BaseModel, Field, field_validator
from pydantic_core import ValidationError


class CalculateApartmentBody(BaseModel):
    first_investment_rate: Decimal = Field(max_digits=20, decimal_places=2)
    first_payment_date: date
    period_count: int

    @field_validator("first_investment_rate")
    @classmethod
    def validate_first_investment_rate(cls, value):
        if value < 0:
            raise ValidationError("Первая инвестиция не может быть отрицательной.")
        return value

    @field_validator("period_count")
    @classmethod
    def validate_period_count(cls, value):
        if value < 0:
            raise ValidationError("Количество периудов не может быть отрицательным числом.")
        return value













