from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from core.base_model import BaseModel


class Role(BaseModel):
    __tablename__ = 'roles'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(256), unique=True, nullable=False)

    users = relationship("User", back_populates="role", lazy="selectin")

