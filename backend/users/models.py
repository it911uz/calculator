from sqlalchemy import Column, Integer, String, Boolean

from backend.core.base_model import BaseModel


class User(BaseModel):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(256), unique=True, nullable=False)
    hashed_password = Column(String(512))
    is_superuser = Column(Boolean, default=False)







