from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from core.base_model import BaseModel


class Complex(BaseModel):
    __tablename__ = "complexes"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(256), nullable=False)
    description = Column(String(512), nullable=True)

    buildings = relationship("Building", back_populates="complex")

