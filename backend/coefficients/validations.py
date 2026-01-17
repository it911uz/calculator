from buildings.models import Building
from coefficients.models import BuildingCoefficient
from core.validations import BaseValidator


class BuildingCoefficientValidator(BaseValidator):
    async def validate_building_fk(self, building_id):
        await self.validate_foreign_key(Building, building_id)


class BuildingCoefficientTypeValidator(BaseValidator):
    async def validate_building_fk(self, building_id):
        await self.validate_foreign_key(Building, building_id)

    async def validate_coefficient_fk(self, coefficient_id):
        await self.validate_foreign_key(BuildingCoefficient, coefficient_id)



