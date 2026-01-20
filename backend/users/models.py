from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from core.db.base_model import BaseModel


class User(BaseModel):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(256), unique=True, nullable=False)
    hashed_password = Column(String(512))
    is_superuser = Column(Boolean, default=False)

    role_id = Column(Integer, ForeignKey('roles.id', ondelete="SET NULL"), nullable=True)
    role = relationship("Role", back_populates="users", lazy="selectin")





