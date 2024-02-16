from typing import List, Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.schemas.task import TaskRead, TaskCreate
import src.services.task_service as service
from src.config.db_config import get_db
from src.routers.user import get_bearer_token
from fastapi_jwt_auth import AuthJWT
from fastapi.security import HTTPAuthorizationCredentials


router = APIRouter(
    prefix="/tasks",
    tags=["tasks"],
    responses={404: {"detail": "Not found"}},
)
