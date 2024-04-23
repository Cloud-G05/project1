from datetime import datetime
import shutil
from fastapi import HTTPException
from fastapi.responses import FileResponse, StreamingResponse
from sqlalchemy.orm import Session
import os
import sys
from celery import Celery
from uuid import uuid4
from fastapi import File, UploadFile
import mimetypes
from google.cloud import pubsub_v1
from google.cloud import storage

storage_client = storage.Client()
bucket_name = "cloud_entrega_3"

# Crea una instancia del cliente de Pub/Sub con las credenciales
publisher = pubsub_v1.PublisherClient()

sys.path.append('../')
from back.src.schemas.task import TaskCreate, TaskRead
from back.src.services.user_service import get_user_by_email
from back.src.models.task import Task as TaskModel
from dotenv import load_dotenv

load_dotenv()

#celery_app = Celery('tasks', broker=os.getenv("REDIS_URL"))

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
    
    #save_file(task.input_file_path, "/uploads")
    #task_result = convert_to_pdf.apply_async(args=["../back/uploads/"+input_file_name, output_file_path])
    #task_result = celery_app.send_task('tasks.convert_to_pdf', args=["/uploads/"+input_file_name, output_file_path])
    task_id = str(uuid4())
    send_message('projects/my-cloud-project-418900/topics/file_conversion', f'convert_to_pdf {"uploads/"+input_file_name} {output_file_path} {task_id}')
    new_task = TaskModel(
        id=task_id,
        name = task.name,
        original_file_ext = input_file_extension,
        converted_file_ext = task.converted_file_ext,
        time_stamp = datetime.now(),
        input_file_path="uploads/"+input_file_name,
        output_file_path=output_file_path,
        user_email = task.user_email
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task

def save_file(source_path: str, file: UploadFile = File(...)):

    # os.makedirs(destination_directory, exist_ok=True)
        
    # # Get the file name from the source path
    # file_name = os.path.basename(source_path)
    # # Copy the file to the destination directory
    # destination_path = os.path.join(destination_directory, file_name)
    # shutil.copy(source_path, destination_path)

    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(source_path)
    blob.upload_from_filename('/'+source_path, if_generation_match=0)

def send_message(pubsub_topic, message):
    # Publica el mensaje en el tema
    future = publisher.publish(pubsub_topic, message.encode('utf-8'))
    # Espera a que se complete la publicación (opcional)
    #future.result()
    

def delete_task(db: Session, task_id: str) -> TaskRead:
    task = get_task_by_id(db, task_id)
    if not task.available:
        raise HTTPException(status_code=404, detail="Task not found")
    # output_path_relative_to_back = task.output_file_path.split("../")[-1]
    # input_path_relative_to_back = task.input_file_path.split("../")[-1]
    # if not os.path.exists(output_path_relative_to_back) or not os.path.exists(input_path_relative_to_back):
    #     raise HTTPException(status_code=404, detail="File not found")
    # os.remove(task.output_file_path)
    # os.remove(task.input_file_path)
    #input_filename = task.input_file_path.split("/")[-1]

    # Get a reference to the bucket
    bucket = storage_client.bucket(bucket_name)
    # Get a reference to the file
    blob_org = bucket.blob(task.input_file_path)
    blob_conv = bucket.blob(task.output_file_path)

    # Check if the file exists
    if not blob_org.exists() or not blob_conv.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    # Delete the file
    blob_org.delete()
    blob_conv.delete()

    #os.remove("/nfs/general/uploadsCopy/" + input_filename)
    task.available = False
    # db.delete(task)
    db.commit()
    db.refresh(task)


def download_file(filename: str, db: Session, Authorize) -> TaskRead:
    user = get_user_by_email(db, Authorize.get_jwt_subject())
    
    if ".pdf" in filename:
        filename_path = "/results/" + filename
        task = db.query(TaskModel).filter(TaskModel.output_file_path == filename_path).first()
        #path_relative_to_back = "../nfs/general/results/" + filename
    else:
        filename_path = "/uploads/" + filename
        task = db.query(TaskModel).filter(TaskModel.input_file_path == filename_path).first()
        #path_relative_to_back = "../nfs/general/uploads/" + filename
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if user.email != task.user_email:
        raise HTTPException(status_code=404, detail="User not authorized to download this file")
    if not task.available:
        raise HTTPException(status_code=404, detail="Task not found")
    # if not os.path.exists(path_relative_to_back):
    #     raise HTTPException(status_code=404, detail="File not found")
    
    # Conexión a Google Cloud Storage
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)

    # Obtener la referencia del archivo en el bucket
    blob = bucket.blob(filename_path)

    if not blob.exists():
        raise HTTPException(status_code=404, detail="File not found")

    # Descargar el archivo# Get the MIME type based on the file extension
    mime_type, _ = mimetypes.guess_type(filename)
    # Default to "application/octet-stream" if MIME type cannot be determined
    media_type = mime_type if mime_type else "application/octet-stream"
    return StreamingResponse(blob.download_as_bytes(), media_type=media_type)

    #return FileResponse(filename_path, filename = filename)