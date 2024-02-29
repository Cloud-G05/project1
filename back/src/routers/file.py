from fastapi import APIRouter, Depends, File, UploadFile
from fastapi.security import HTTPAuthorizationCredentials
from fastapi_jwt_auth import AuthJWT
from sqlalchemy.orm import Session
import sys
sys.path.append('../')
from back.src.routers.user import get_bearer_token
from back.src.config.db_config import get_db
import back.src.services.task_service as service

router = APIRouter(
    prefix="/files",
    tags=["files"],
    responses={404: {"detail": "Not found"}},
)

@router.post("/uploadfile", status_code=201)
async def upload_file(db: Session = Depends(get_db), file: UploadFile = File(...), token: HTTPAuthorizationCredentials | None = Depends(get_bearer_token), Authorize: AuthJWT = Depends()):
    contents = await file.read()
    return {"filename": file.filename, "contents": contents}


@router.get("/{filename}", status_code=200)
def download_file(filename: str, db: Session = Depends(get_db), token: HTTPAuthorizationCredentials | None = Depends(get_bearer_token), Authorize: AuthJWT = Depends()):
    return service.download_file(filename, db, Authorize)
