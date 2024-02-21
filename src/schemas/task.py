from pydantic import BaseModel
from datetime import datetime
from src.models.task import TaskStatus
from typing import Optional

class TaskBase(BaseModel):
    input_file_path: str
    converted_file_ext: str
    name: str
    user_email: str

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "input_file_path": "path/to/file",
                "converted_file_ext": "pdf",
                "name": "task name",
                "user_email": "user@outlook.com"
            }
        }

class TaskCreate(TaskBase):
    pass

class TaskRead(TaskBase):
    id: str
    status: TaskStatus
    time_stamp: datetime
    original_file_ext: str
    available: bool
    output_file_path: Optional[str]

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "input_file_path": "path/to/file",
                "converted_file_ext": "pdf",
                "name": "task name",
                "user_email": "user@outlook.com",
                "id": "4f21a77d-b8fa-47bb-8df6-b772a635bc19",
                "status": "UPLOADED",
                "time_stamp": "2021-07-07T00:00:00",
                "original_file_ext": "docx",
                "available": True,
                "output_file_path": "path/to/file"
            }
        }