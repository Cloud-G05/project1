from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from src.config.db_config import Base

class User(Base):
    __tablename__ = 'users'

    id_user = Column(Integer, primary_key=True, index=True, autoincrement=True)
    # para dejar el id_usuario como llave única y escalar con indice númerico, como TASK

    email = Column(String,unique=True)
    username = Column(String, unique=True)
    password = Column(String)

    tasks = relationship('Task', back_populates='user', cascade='all, delete-orphan', passive_deletes=True)