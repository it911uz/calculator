import os
from pathlib import Path

import pytz
from dotenv import load_dotenv


load_dotenv()


origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://192.168.1.101:3000",
    "http://192.168.1.103:3000",
    "http://192.168.1.100:3000",
    "https://lqwk2vh0-3000.euw.devtunnels.ms"
]


TIMEZONE = pytz.timezone('Asia/Tashkent')
DATABASE_URL = os.getenv('DATABASE_URL')
ASYNC_DATABASE_URL = os.getenv('ASYNC_DATABASE_URL')
# Auth
SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = "HS256"
ACCESS_TIME = 360
REFRESH_TIME = 120

MAX_FILE_SIZE = 5 * 1024 * 1024

BASE_DIR = Path(__file__).resolve().parent.parent.parent
IMAGES_DIR = BASE_DIR / "images"

IMAGES_DIR.mkdir(parents=True, exist_ok=True)

BASE_URL = "http://172.18.0.1:8001/"


