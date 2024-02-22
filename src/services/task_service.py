from datetime import datetime
import uuid
from fastapi import HTTPException
from sqlalchemy.orm import Session
from celery_app.tasks import convert_to_pdf
from src.schemas.task import TaskCreate, TaskRead
from src.models.task import Task as TaskModel
from src.services.user_service import get_user_by_email


def get_task_by_id(db: Session, task_id: str) -> TaskRead:
    task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

def create_task(db: Session, task: TaskCreate) -> TaskRead:
    
    allowed_extensions = ["docx", "pptx", "odt", "xlsx"]
    
    if not task.input_file_path:
        raise HTTPException(status_code= 404, detail="Input file path must be provided")
    if "." not in task.input_file_path:
        raise HTTPException(status_code= 404, detail="Input file path must have an extension")
    
    input_file_name = task.input_file_path.split("/")[-1]
    input_file_extension = task.input_file_path.split(".")[-1]
    if input_file_extension not in allowed_extensions:
        raise HTTPException(status_code= 405, detail="Input file extension not allowed")
    
    if not task.converted_file_ext:
        raise HTTPException(status_code= 404, detail="Conversion file extension must be provided")
    if task.converted_file_ext != "pdf":
        raise HTTPException(status_code= 400, detail="Conversion file extension must be pdf")
    
    if not task.name:
        raise HTTPException(status_code= 404, detail="Task name must be provided")
    
    if not task.user_email:
        raise HTTPException(status_code= 404, detail="User email must be provided")
    user = get_user_by_email(db, task.user_email)
    if not user:
        raise HTTPException(status_code= 404, detail="User email does not exist")
    
    output_file_path="results/" + input_file_name.split(".")[0] + "." + task.converted_file_ext

    task_result = convert_to_pdf.apply_async(args=[task.input_file_path, output_file_path])

    new_task = TaskModel(
        id=str(task_result.id),
        name = task.name,
        original_file_ext = input_file_extension,
        converted_file_ext = task.converted_file_ext,
        time_stamp = datetime.now(),
        input_file_path=task.input_file_path,
        output_file_path=output_file_path,
        user_email = task.user_email
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task


def delete_task(db: Session, task_id: str) -> TaskRead:
    task = get_task_by_id(db, task_id)
    db.delete(task)
    db.commit()


