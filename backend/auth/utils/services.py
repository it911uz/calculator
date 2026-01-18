from passlib.hash import argon2


class PasswordService:
    @staticmethod
    def hash_password(password: str) -> str:
        return argon2.hash(password)










