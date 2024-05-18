import base64
import functions_framework
import requests

# Triggered from a message on a Cloud Pub/Sub topic.
@functions_framework.cloud_event
def suscribe(cloud_event):
    # Print out the data from Pub/Sub, to prove that it worked
    message_data = base64.b64decode(cloud_event.data["message"]["data"]).decode()
    print(f"Received message: {message_data}")
    
    mensaje_split = message_data.split(' ')
    tarea = mensaje_split[0]
    input_file_path = mensaje_split[1]
    output_file_path = mensaje_split[2]
    task_id = mensaje_split[3]
       
    if tarea == 'convert_to_pdf':
        url = f"https://worker-mhdc5bmumq-uk.a.run.app/convert?input_file={input_file_path}&output_file={output_file_path}&task_id={task_id}"
        response = requests.post(url)
        if response.status_code == 200:
            print("Request successful!")
    
        else:
            print("Request failed with status code:", response.status_code)
  
