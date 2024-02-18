from sqlalchemy import Column, ForeignKey, String, Integer, DateTime, Enum, Boolean
from sqlalchemy.orm import relationship
from src.config.db_config import Base
import enum

class TaskStatus(enum.Enum):
    UPLOADED = 'UPLOADED'
    PROCESSED = 'PROCESSED'

class Task(Base):
    __tablename__ = 'tasks'

    id = Column(Integer, primary_key=True, index = True)
    name = Column(String)
    original_file_ext = Column(String)
    converted_file_ext = Column(String)
    available = Column(Boolean, default=True)
    status = Column(Enum(TaskStatus), default=TaskStatus.UPLOADED)
    time_stamp = Column(DateTime)
    input_file_path = Column(String)
    output_file_path = Column(String)

    user_id = Column(String, ForeignKey("users.id"))

    user = relationship('User', back_populates='tasks')

   