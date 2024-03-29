from pydantic import BaseSettings
import os

class Settings(BaseSettings):
    PROJECT_NAME = "File Converter"
    DB_NAME = "file_converter"
    DB_USER = "postgres"
    DB_PASSWORD = '123456'
    DB_HOST = "postgres"
    DB_PORT = '5432'

class AuthSettings(BaseSettings):
    authjwt_secret_key: str = "secret"

    class Config:
        case_sensitive = True

settings = Settings()