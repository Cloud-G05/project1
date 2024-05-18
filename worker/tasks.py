import subprocess
from fastapi import FastAPI, status, Request
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import sys
import os
from dotenv import load_dotenv
import psycopg2
from google.cloud import storage


app = FastAPI()




app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return RedirectResponse(url="/docs")

load_dotenv()

DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")

storage_client = storage.Client()
bucket_name = "cloud_entrega_3"


def update_task_status(task_id, status):#
    try:
        conn = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST
        )
        cursor = conn.cursor()
        cursor.execute(
            f"UPDATE tasks SET status = '{status}' WHERE id = '{task_id}'"
        )
        conn.commit()
    except psycopg2.Error as e:
        print(f"Error updating task status: {e}")
    finally:
        cursor.close()
        conn.close()

@app.post('/convert')
def convert_pdf(input_file: str, output_file: str, task_id: str):
    try:
        bucket = storage_client.bucket(bucket_name)
        input_blob = bucket.blob(input_file)
        input_blob.download_to_filename(input_file.split("/")[-1])
        
        subprocess.run(['soffice', '--headless', '--convert-to','pdf', output_file.split('/')[-1], input_file.split("/")[-1]], check=True)
        
        print(f"Conversion completed: {input_file} -> {output_file}")

        output_blob = bucket.blob(output_file)
        #output_blob.upload_from_string(converted_file.stdout)
        output_blob.upload_from_filename(output_file.split('/')[-1])

        print(f'Task {task_id} completed successfully.')
        # Update the task status to PROCESSED
        update_task_status(task_id, "PROCESSED")

        os.remove(output_file.split('/')[-1])
        os.remove(input_file.split('/')[-1])
        return output_file
    except subprocess.CalledProcessError as e:
        print(f"Conversion failed: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

    