import os

import pytz
from dotenv import load_dotenv


load_dotenv()


origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000",
]


TIMEZONE = pytz.timezone('Asia/Tashkent')
DATABASE_URL = os.getenv('DATABASE_URL')
ASYNC_DATABASE_URL = os.getenv('ASYNC_DATABASE_URL')
# Auth
SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = "HS256"
ACCESS_TIME = 30
REFRESH_TIME = 30


