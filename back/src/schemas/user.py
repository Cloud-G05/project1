from pydantic import BaseModel
from typing import Optional
from src.schemas.task import TaskRead
from typing import List

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
                        "user_id": "60e3b2be-b29d-442c-b5ea-6337d0044a9e",
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
