import subprocess
import sys
import psycopg2
from google.cloud import storage, pubsub_v1
from dotenv import load_dotenv
import os
import pandas as pd
import pypandoc
sys.path.append('../')
load_dotenv()

DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")

storage_client = storage.Client()
bucket_name = "cloud_entrega_3"


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
    bucket = storage_client.bucket(bucket_name)
    input_blob = bucket.blob(input_file)
    input_blob.download_to_filename(input_file.split("/")[-1])
    # Execute the unoconv command to convert the PPTX file to PDF

    if input_file.split(".")[-1] == "xlsx":
        wb = pd.read_excel(input_file.split("/")[-1])
        wb.to_html(output_file.split("/")[-1].split(".")[0]+".html")
        pypandoc.convert_file(output_file.split("/")[-1].split(".")[0]+".html", 'pdf', outputfile=output_file.split("/")[-1], extra_args=['--pdf-engine=pdflatex'])
        os.remove(output_file.split('/')[-1].split(".")[0]+".html")
    else:
        pypandoc.convert_file(input_file.split("/")[-1], 'pdf', outputfile=output_file.split("/")[-1], extra_args=['--pdf-engine=pdflatex'])
    #subprocess.run(['unoconv', '-f', 'pdf', '-o', output_file.split('/')[-1], input_file.split("/")[-1]], check=True)
    #converted_file = subprocess.run(['unoconv', '-f', 'pdf', '-'], input=input_blob.download_as_bytes(), capture_output=True, check=True)
    
    #print(f"Conversion completed: {input_file} -> {output_file}")

    output_blob = bucket.blob(output_file)
    #output_blob.upload_from_string(converted_file.stdout)
    output_blob.upload_from_filename(output_file.split('/')[-1])

    print(f'Task {task_id} completed successfully.')
    # Update the task status to PROCESSED
    update_task_status(task_id, "PROCESSED")

    os.remove(output_file.split('/')[-1])
    os.remove(input_file.split('/')[-1])
    return output_file


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