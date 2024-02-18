from pydantic import BaseModel
from typing import Optional, List
from src.schemas.task import TaskRead


class UserBase(BaseModel):
    password: str

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "password": "12345678"
            }
        }

class UserCreate(UserBase):
    email: str
    username: str

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "email": "user@outlook.com",
                "username": "user",
                "password": "12345678"
            }
        }

class UserLogin(UserBase):
    email: Optional[str]
    username: Optional[str]

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "email": "user@outlook.com",
                "username": "user",
                "password": "12345678"
            }
        }

class UserRead(UserCreate):
    id_user: int  # para tomar el id_user
    tasks: List[TaskRead]

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "email": "user@outlook.com",
                "username": "user",
                "password": "12345678",
                "tasks": [
                    {
                        "input_file_path": "path/to/file",
                        "converted_file_ext": "pdf",
                        "name": "task name",
                        "id_user": "123",
                        "id": "4f21a77d-b8fa-47bb-8df6-b772a635bc19",
                        "status": "UPLOADED",
                        "time_stamp": "2021-07-07T00:00:00",
                        "original_file_ext": "docx",
                        "available": True,
                        "output_file_path": "path/to/file"
                    }
                ]
            }
        }
