from celery import Celery
import subprocess
from celery.signals import task_success
import sys
import psycopg2
sys.path.append('../')
#from back.src.models.task import TaskStatus

celery_app = Celery('tasks', broker='redis://redis:6379/0', backend='redis://redis:6379/0')

DB_NAME = "file_converter"
DB_USER = "postgres"
DB_PASSWORD = "123456"
DB_HOST = "postgres"

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

@celery_app.task(name='tasks.convert_to_pdf')
def convert_to_pdf(input_file, output_file):
    try:
        # Execute the unoconv command to convert the PPTX file to PDF
        subprocess.run(['unoconv', '-f', 'pdf', '-o', output_file, input_file], check=True)
        print(f"Conversion completed: {input_file} -> {output_file}")
        return output_file
    except subprocess.CalledProcessError as e:
        print(f"Conversion failed: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

@task_success.connect
def handle_task_success(sender, **kwargs):
    if sender:
        task_id = sender.request.id
        print(f'Task {task_id} completed successfully.')
        update_task_status(task_id, "PROCESSED")
    else:
        print('No sender object found.')

