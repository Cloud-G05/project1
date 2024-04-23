from fastapi import APIRouter, Depends, File, UploadFile
from fastapi.security import HTTPAuthorizationCredentials
from fastapi_jwt_auth import AuthJWT
from sqlalchemy.orm import Session
import sys
import os
from fastapi import HTTPException
sys.path.append('../')
from back.src.routers.user import get_bearer_token
from back.src.config.db_config import get_db
import back.src.services.task_service as service

router = APIRouter(
    prefix="/files",
    tags=["files"],
    responses={404: {"detail": "Not found"}},
)


UPLOAD_DIR = "../../uploads"  # Carpeta donde guardar los archivos
@router.post("/uploadfile", status_code=201)
async def upload_file(file: UploadFile = File(...)):
    try:
        # Leer el contenido del archivo
        contents = await file.read()

        # Verificar si la carpeta UPLOAD_DIR existe, si no, crearla
        if not os.path.exists(UPLOAD_DIR):
            os.makedirs(UPLOAD_DIR)

        # Crear la ruta completa del archivo en la carpeta uploadsCopy
        file_path = os.path.join(UPLOAD_DIR, file.filename)

        # Guardar el archivo en la carpeta uploadsCopy
        with open(file_path, "wb") as f:
            f.write(contents)
        service.save_file('uploads/'+file.filename, file)
        return {"filename": file.filename}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{filename}", status_code=200)
def download_file(filename: str, db: Session = Depends(get_db), token: HTTPAuthorizationCredentials | None = Depends(get_bearer_token), Authorize: AuthJWT = Depends()):
    return service.download_file(filename, db, Authorize)
