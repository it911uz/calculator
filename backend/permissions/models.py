from sqlalchemy import Column, Integer, String

from core.base_model import BaseModel


class Permission(BaseModel):
    __tablename__ = "permissions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(256), nullable=False)
    codename = Column(String(256), nullable=False)
