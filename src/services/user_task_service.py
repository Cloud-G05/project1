from sqlalchemy.orm import Session
from src.services.user_service import get_user_by_email
from src.models.user import User
from src.models.task import Task
from typing import List


def get_tasks_by_user_email(db: Session, email: str) -> list:
    user: User = get_user_by_email(db, email)
    return user.tasks