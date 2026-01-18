# core/model_registry.py
from core.db.base_model import BaseModel

# RBAC

from users.models import User
from roles.models import Role
from permissions.models import Permission
from role_permissions.models import role_permission

from complexes.models import Complex
from buildings.models import Building
from apartments.models import Apartment
from coefficients.models import BuildingCoefficient, BuildingCoefficientType, apartment_coefficients

# Domain

# This is what Alembic uses
target_metadata = BaseModel.metadata
