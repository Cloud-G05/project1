from typing import List, Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.schemas.task import TaskRead, TaskCreate
import src.services.task_service as service
import src.services.user_task_service as user_task_service
from src.config.db_config import get_db
from src.routers.user import get_bearer_token
from fastapi_jwt_auth import AuthJWT
from fastapi.security import HTTPAuthorizationCredentials
from src.services.authorization_service import authorized_user_email


router = APIRouter(
    prefix="/tasks",
    tags=["tasks"],
    responses={404: {"detail": "Not found"}},
)


@router.get("/", response_model=List[TaskRead], status_code=200)
def get_tasks_by_user_email(email: str, db: Session = Depends(get_db), token: HTTPAuthorizationCredentials | None = Depends(get_bearer_token), Authorize: AuthJWT = Depends()):
    authorized_user_email(Authorize, email)
    return user_task_service.get_tasks_by_user_email(db, Authorize)

@router.get("/{task_id}", response_model=TaskRead, status_code=200)
def get_task_by_id(task_id: str, db: Session = Depends(get_db), token: HTTPAuthorizationCredentials | None = Depends(get_bearer_token), Authorize: AuthJWT = Depends()):
    task = service.get_task_by_id(db, task_id)
    user_email = task.user_email
    authorized_user_email(Authorize, user_email)
    return task

@router.post("/", response_model=TaskRead, status_code=201)
def create_task(task: TaskCreate, db: Session = Depends(get_db), token: HTTPAuthorizationCredentials | None = Depends(get_bearer_token), Authorize: AuthJWT = Depends()):
    authorized_user_email(Authorize, task.user_email)
    return service.create_task(db, task)


@router.delete("/{task_id}", status_code=204)
def delete_task(task_id: str, db: Session = Depends(get_db), token: HTTPAuthorizationCredentials | None = Depends(get_bearer_token), Authorize: AuthJWT = Depends()):
    task = service.get_task_by_id(db, task_id)
    authorized_user_email(Authorize, task.user_email)
    service.delete_task(db, task_id)
   