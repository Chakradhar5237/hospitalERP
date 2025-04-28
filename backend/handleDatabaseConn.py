from sqlalchemy import create_engine, Column, String, Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pymongo import MongoClient

# SQLAlchemy setup (SQLite)
Base = declarative_base()
engine = create_engine('sqlite:///db/user_database.db', echo=True)

class User(Base):
    __tablename__ = 'users'

    CardNumber = Column(String, primary_key=True)
    UserName = Column(String)
    MobileNumber = Column(String)
    Email = Column(String)
    Status = Column(String)
    DateOfBirth = Column(Date)
    ProfileImageBase64 = Column(String)  # <- Updated to store image as base64
    Password = Column(String)

# Create SQLite table
Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()

# MongoDB setup
client = MongoClient("mongodb://localhost:27017/")
mongo_db = client["healthcare_db"]
collection = mongo_db["medical_records"]
