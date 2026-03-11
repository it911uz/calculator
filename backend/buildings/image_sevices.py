import shutil
from uuid import uuid4

from fastapi import UploadFile, HTTPException

from core.config import IMAGES_DIR


async def save_image(file: UploadFile, path: str | None = None) -> str:
    if path:
        upload_dir = IMAGES_DIR / path
        upload_dir.mkdir(parents=True, exist_ok=True)
    else:
        upload_dir = IMAGES_DIR

    filename = f"{uuid4()}.webp"

    file_path = upload_dir / filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return path + "/" + filename if path else filename


async def delete_image(file_path: str | None):
    if file_path is None:
        return

    try:
        full_path = IMAGES_DIR / file_path

        full_path = full_path.resolve()
        if not str(full_path).startswith(str(IMAGES_DIR.resolve())):
            raise HTTPException(status_code=400, detail="Invalid file path")

        if full_path.exists() and full_path.is_file():
            full_path.unlink()

    except Exception as e:
        print(e)









