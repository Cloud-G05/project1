
from celery import Celery
import subprocess

app = Celery( 'tasks', broker = 'redis://localhost:6379/0' )


@app.task(name='tasks.convert_to_pdf')
def convert_to_pdf(input_file, output_file):
    try:
        # Execute the unoconv command to convert the PPTX file to PDF
        subprocess.run(['unoconv', '-f', 'pdf', '-o', output_file, input_file], check=True)
        print(f"Conversion completed: {input_file} -> {output_file}")
    except subprocess.CalledProcessError as e:
        print(f"Conversion failed: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
