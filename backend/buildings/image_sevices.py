from fastapi import UploadFile

from core.storage import upload_file, delete_file


async def save_image(file: UploadFile, path: str | None = None) -> str:
    """Upload image to MinIO, return full public URL."""
    folder = path or ""
    return await upload_file(file, folder=folder)


async def delete_image(url: str | None):
    """Delete image from MinIO by full URL."""
    await delete_file(url)
