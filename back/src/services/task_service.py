from datetime import datetime
import shutil
from fastapi import HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os
import sys
from celery import Celery
sys.path.append('../')
from back.src.schemas.task import TaskCreate, TaskRead
from back.src.services.user_service import get_user_by_email
from back.src.models.task import Task as TaskModel

celery_app = Celery('tasks', broker='redis://redis:6379/0', backend='redis://redis:6379/0')

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
    
    output_file_path="/back/results/" + input_file_name.split(".")[0] + "." + task.converted_file_ext
    save_file(task.input_file_path, "/back/uploads")
    #task_result = convert_to_pdf.apply_async(args=["../back/uploads/"+input_file_name, output_file_path])
    task_result = celery_app.send_task('tasks.convert_to_pdf', args=["/back/uploads/"+input_file_name, output_file_path])
    new_task = TaskModel(
        id=str(task_result.id),
        name = task.name,
        original_file_ext = input_file_extension,
        converted_file_ext = task.converted_file_ext,
        time_stamp = datetime.now(),
        input_file_path="/back/uploads/"+input_file_name,
        output_file_path=output_file_path,
        user_email = task.user_email
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task

def save_file(source_path: str, destination_directory: str):

    os.makedirs(destination_directory, exist_ok=True)
        
    # Get the file name from the source path
    file_name = os.path.basename(source_path)
    # Copy the file to the destination directory
    destination_path = os.path.join(destination_directory, file_name)
    shutil.copy(source_path, destination_path)
    

def delete_task(db: Session, task_id: str) -> TaskRead:
    task = get_task_by_id(db, task_id)
    if not task.available:
        raise HTTPException(status_code=404, detail="Task not found")
    output_path_relative_to_back = task.output_file_path.split("../")[-1]
    input_path_relative_to_back = task.input_file_path.split("../")[-1]
    if not os.path.exists(output_path_relative_to_back) or not os.path.exists(input_path_relative_to_back):
        raise HTTPException(status_code=404, detail="File not found")
    os.remove(task.output_file_path)
    os.remove(task.input_file_path)
    input_filename = task.input_file_path.split("/")[-1]
    os.remove("/back/uploadsCopy/" + input_filename)
    task.available = False
    # db.delete(task)
    db.commit()
    db.refresh(task)


def download_file(filename: str, db: Session, Authorize) -> TaskRead:
    user = get_user_by_email(db, Authorize.get_jwt_subject())
    
    if ".pdf" in filename:
        filename_path = "/back/results/" + filename
        task = db.query(TaskModel).filter(TaskModel.output_file_path == filename_path).first()
        path_relative_to_back = "results/" + filename
    else:
        filename_path = "/back/uploads/" + filename
        task = db.query(TaskModel).filter(TaskModel.input_file_path == filename_path).first()
        path_relative_to_back = "uploads/" + filename
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if user.email != task.user_email:
        raise HTTPException(status_code=404, detail="User not authorized to download this file")
    if not task.available:
        raise HTTPException(status_code=404, detail="Task not found")
    if not os.path.exists(path_relative_to_back):
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(filename_path, filename = filename)