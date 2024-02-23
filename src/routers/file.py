from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from src.routers.user import get_bearer_token
from src.config.db_config import get_db
from fastapi_jwt_auth import AuthJWT
import src.services.task_service as service
from src.services.authorization_service import authorized_user_email

router = APIRouter(
    prefix="/files",
    tags=["files"],
    responses={404: {"detail": "Not found"}},
)


@router.get("/{filename}", status_code=200)
def download_file(filename: str, db: Session = Depends(get_db), token: HTTPAuthorizationCredentials | None = Depends(get_bearer_token), Authorize: AuthJWT = Depends()):
    return service.download_file(filename, db, Authorize)
