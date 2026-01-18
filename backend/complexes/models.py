from sqlalchemy import Column, Integer, String

from core.db.base_model import BaseModel


class Complex(BaseModel):
    __tablename__ = "complexes"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(256), nullable=False)
    description = Column(String(512), nullable=True)

