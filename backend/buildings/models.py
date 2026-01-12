from sqlalchemy import Column, Integer, String, ForeignKey, Numeric
from sqlalchemy.orm import relationship

from comlexes.models import Complex
from core.base_model import BaseModel


class Building(BaseModel):
    __tablename__ = "buildings"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(256), nullable=False)
    floor_count = Column(Integer, nullable=False)
    base_count = Column(Numeric(precision=20, scale=2), nullable=False)
    price_unit = Column(String(10), nullable=False, default="UZS")
    maxCoefficient = Column(Numeric(precision=20, scale=2), nullable=False)

    complex_id = Column(Integer, ForeignKey("complexes.id", ondelete="CASCADE"))
    complex = relationship(Complex, back_populates="buildings", lazy="selectin")
