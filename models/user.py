from pydantic import BaseModel

class LoginInput(BaseModel):
    username: str
    password: str

class UserInput(BaseModel):
    username: str
    password: str
    confirm_password: str
    site: str

class UserResponse(BaseModel):
    username: str
    role: str
    site: str
    token: str