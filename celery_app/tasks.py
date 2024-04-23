from celery import Celery
import subprocess
from celery.signals import task_success
import sys
import psycopg2
from google.cloud import storage, pubsub_v1
from dotenv import load_dotenv
import os
sys.path.append('../')
#from back.src.models.task import TaskStatus
load_dotenv()
#celery_app = Celery('tasks', broker=os.getenv("REDIS_URL"))

DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")

storage_client = storage.Client()
bucket_name = "cloud_entrega_3"

# subscriber = pubsub_v1.SubscriberClient()
# subscription_path = subscriber.subscription_path('my-cloud-project-418900', 'projects/my-cloud-project-418900/subscriptions/file_conversion-sub')

def callback(message):
    # Process the incoming message
    message_data = message.data.decode('utf-8')

    print(f"Received message: {message_data}")
    mensaje_split = message_data.split(' ')
    tarea = mensaje_split[0]
    input_file_path = mensaje_split[1]
    output_file_path = mensaje_split[2]
    task_id = mensaje_split[3]
       
    if tarea == 'convert_to_pdf':
        convert_to_pdf(input_file_path, output_file_path, task_id)

    # Acknowledge the message
    message.ack()

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

#@celery_app.task(name='tasks.convert_to_pdf')
def convert_to_pdf(input_file, output_file, task_id):
    try:
        bucket = storage_client.bucket(bucket_name)
        input_blob = bucket.blob(input_file)
        input_blob.download_to_filename('/'+input_file)
        # Execute the unoconv command to convert the PPTX file to PDF
        subprocess.run(['unoconv', '-f', 'pdf', '-o', "/"+output_file, "/"+input_file], check=True)
        #converted_file = subprocess.run(['unoconv', '-f', 'pdf', '-'], input=input_blob.download_as_bytes(), capture_output=True, check=True)
        
        print(f"Conversion completed: {input_file} -> {output_file}")

        output_blob = bucket.blob(output_file)
        #output_blob.upload_from_string(converted_file.stdout)
        output_blob.upload_from_filename('/'+output_file, if_generation_match=0)

        print(f'Task {task_id} completed successfully.')
        # Update the task status to PROCESSED
        update_task_status(task_id, "PROCESSED")

        os.remove('/'+output_file)
        os.remove('/'+input_file)
        return output_file
    except subprocess.CalledProcessError as e:
        print(f"Conversion failed: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

# @task_success.connect
# def handle_task_success(sender, **kwargs):
#     if sender:
#         task_id = sender.request.id
#         print(f'Task {task_id} completed successfully.')
#         update_task_status(task_id, "PROCESSED")
#     else:
#         print('No sender object found.')


# # Subscribe to the topic and attach the callback function
# subscriber.subscribe(subscription_path, callback=callback)
# # Start the subscriber
# print("Listening for messages...")
# while True:
#     pass

with pubsub_v1.SubscriberClient() as subscriber:
    future = subscriber.subscribe('projects/my-cloud-project-418900/subscriptions/file_conversion-sub', callback)
    try:
        future.result()
    except KeyboardInterrupt:
        future.cancel()