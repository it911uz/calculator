from fastapi import UploadFile

from complexes.models import Complex
from core.validations import BaseValidator


class BuildingValidator(BaseValidator):
    async def validate_complex_fk(self, complex_fk):
        await super().validate_foreign_key(Complex, complex_fk)

    async def validate_image(self, image: UploadFile):
        pass













