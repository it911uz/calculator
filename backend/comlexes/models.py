from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from core.base_model import BaseModel
from buildings.models import Building


class Complex(BaseModel):
    __tablename__ = "complexes"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(256), nullable=False)
    description = Column(String(512), nullable=True)

