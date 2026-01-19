from pydantic import BaseModel


class UserListResponse(BaseModel):
    id: int
    username: str
    role_id: int | None


class UserCreateBody(BaseModel):
    username: str
    password: str
    role_id: int | None = None


class UserCreateResponse(UserListResponse):
    pass


class UserGetResponse(UserListResponse):
    pass


class UserUpdateBody(BaseModel):
    username: str | None = None
    role_id: int | None = None


class UserUpdateResponse(UserListResponse):
    pass










