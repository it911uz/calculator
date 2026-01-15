from sqlalchemy import Column, Integer, String, ForeignKey, Numeric
from sqlalchemy.orm import relationship

from buildings.models import Building
from core.base_model import BaseModel
from coefficients.models import apartment_coefficients


class Apartment(BaseModel):
    __tablename__ = "apartments"

    id = Column(Integer, primary_key=True, autoincrement=True)
    number = Column(String(256), nullable=False)
    floor = Column(Integer, nullable=False)
    area = Column(Numeric(precision=20, scale=2), nullable=False)
    room_count = Column(Integer, nullable=False)
    final_price = Column(Numeric(precision=20, scale=2), nullable=False, default=0)

    building_id = Column(Integer, ForeignKey("buildings.id", ondelete="CASCADE"), nullable=False)
    building_coefficient_types = relationship("BuildingCoefficientType", secondary=apartment_coefficients, back_populates="apartments", lazy="selectin")



