from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from core.base_model import BaseModel
from role_permissions.models import role_permission


class Permission(BaseModel):
    __tablename__ = "permissions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(256), nullable=False, unique=True)
    codename = Column(String(256), nullable=False, unique=True)

    roles = relationship("Role", secondary=role_permission, back_populates="permissions", lazy="selectin")



