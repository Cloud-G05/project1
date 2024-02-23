from sqlalchemy.orm import Session
from src.models.user import User as UserModel
from src.schemas.user import UserCreate, UserRead, UserLogin
from src.models.task import Task as TaskModel
from typing import List
from fastapi import HTTPException

def get_user_by_username(db: Session, username: str) -> UserRead:
    user = db.query(UserModel).filter(UserModel.username == username).first()
    return user

def get_user_by_email(db: Session, email: str) -> UserRead:
    user = db.query(UserModel).filter(UserModel.email == email).first()
    return user

def create_user(db: Session, user: UserCreate) -> UserCreate:

    username_provided(user.username)
    if get_user_by_username(db, user.username):
        raise HTTPException(status_code=409, detail ="Username already exists")
    
    email_provided(user.email)
    if get_user_by_email(db, user.email):
        raise HTTPException(status_code=409, detail ="Email already exists")

    password_provided(user.password)
    if len(user.password) < 8:
        raise HTTPException(status_code=404, detail="Password must be at least 8 characters long")
    
    new_user = UserModel(
        username=user.username,
        email=user.email,
        password=user.password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def login_user(db: Session, user: UserLogin)->UserRead:
    
    if user.username:
        user = get_user_by_username(db, user.username)
    elif user.email:
        user = get_user_by_email(db, user.email)
    else:
        raise HTTPException(status_code=404, detail="Username or email must be provided")
    
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    if user.password != user.password:
        raise HTTPException(status_code=401, detail="Invalid password")
    
    return user

def username_provided(username: str):
    if not username:
        raise HTTPException(status_code=404, detail="Username must be provided")
    
def email_provided(email: str):
    if not email:
        raise HTTPException(status_code=404, detail="Email must be provided")

def password_provided(password: str):
    if not password:
        raise HTTPException(status_code=404, detail="Password must be provided")