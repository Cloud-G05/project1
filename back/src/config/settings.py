from pydantic import BaseSettings
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path="src/.env")

class Settings(BaseSettings):
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "File Converter")
    DB_NAME: str = os.getenv("DB_NAME")
    DB_USER: str = os.getenv("DB_USER")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD")
    DB_HOST: str = os.getenv("DB_HOST")
    DB_PORT: str = os.getenv("DB_PORT")

class AuthSettings(BaseSettings):
    authjwt_secret_key: str = os.getenv("AUTHJWT_SECRET_KEY")

    class Config:
        case_sensitive = True

settings = Settings()