from buildings.models import Building
from core.validations import BaseValidator


class ApartmentValidator(BaseValidator):


    async def validate_building_fk(self, fk):
        await super().validate_foreign_key(Building, fk)




