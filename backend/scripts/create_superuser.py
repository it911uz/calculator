import asyncio
from getpass import getpass

from core.db.session import async_session
from users.models import User
from auth.services.password_service import PasswordService

import core.models


async def main():
    username = input("Username: ")
    password = getpass("Password: ")

    password_match = False
    while not password_match:
        repeat_password = getpass("Repeat Password: ")
        password_match = password == repeat_password

    async with async_session() as session:
        user = User(
            username=username,
            hashed_password=await PasswordService.hash_password(password=password),
            is_superuser=True,
        )

        session.add(user)
        await session.commit()

        print("✅ User created successfully")


if __name__ == "__main__":
    asyncio.run(main())
