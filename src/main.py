from fastapi import FastAPI, status, Request
from fastapi.responses import RedirectResponse, JSONResponse
from src.config.settings import Settings
from src.routers import user, task
from src.config.db_config import engine, Base
from fastapi.middleware.cors import CORSMiddleware
from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException
from src.config.settings import AuthSettings


settings = Settings()
app = FastAPI(title=settings.PROJECT_NAME)

Base.metadata.create_all(bind=engine)

@AuthJWT.load_config
def get_config():
    return AuthSettings()

@app.exception_handler
def exception_handler(request: Request, exc: AuthJWTException):
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={"detail": exc.message}
    )

app.include_router(user.router)
app.include_router(task.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
def root():
    return RedirectResponse(url="/docs")
