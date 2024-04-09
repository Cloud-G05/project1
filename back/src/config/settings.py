from pydantic import BaseSettings
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME = "File Converter"
    DB_NAME = os.getenv("DB_NAME","file_converter" ) 
    DB_USER = os.getenv("DB_USER","postgres")
    DB_PASSWORD = os.getenv("DB_PASSWORD",'123456')
    DB_HOST = os.getenv("DB_HOST","localhost")
    DB_PORT = '5432'

class AuthSettings(BaseSettings):
    authjwt_secret_key: str = "secret"

    class Config:
        case_sensitive = True

settings = Settings()