from sqlalchemy import create_engine, Column, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pymongo import MongoClient
import base64
import time

# Setting up SQLAlchemy (SQLite database)
Base = declarative_base()
engine = create_engine('sqlite:///db/user_database.db', echo=True)

# Define the User table for SQLite
from sqlalchemy import Column, String, Date
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    CardNumber = Column(String, primary_key=True)
    UserName = Column(String)
    MobileNumber = Column(String)
    Email = Column(String)
    Status = Column(String)
    DateOfBirth = Column(Date) 

# Create the tables in the database
Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()

# MongoDB Setup
client = MongoClient("mongodb://localhost:27017/")
mongo_db = client["healthcare_db"]
collection = mongo_db["medical_records"]

# Helper function to add user in SQLite
def add_user():
    pass

# Helper function to encode image to Base64
def encode_image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")

def register_new_user(card_number, user_name, mobile_number, email, status):
    # Step 1: Register user in SQLite
    new_user = User(
        CardNumber=card_number,
        UserName=user_name,
        MobileNumber=mobile_number,
        Email=email,
        Status=status
    )
    session.add(new_user)
    session.commit()

    # Step 2: Initialize MongoDB record without adding any report
    collection.update_one(
        {"CardNumber": card_number},
        {
            "$setOnInsert": {
                "CardNumber": card_number,
                "MedicalHistory": [],
                "Category": [],
                "Reports": {}
            }
        },
        upsert=True
    )

    print(f"User with CardNumber {card_number} registered successfully without any reports.")

# Helper function to encode image to Base64
def encode_image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


# Helper function to insert report into MongoDB
def insert_user_data_with_report(card_number, disease_name, date_str, image_path):
    filename = f"{card_number}_{disease_name}_{date_str}_{int(time.time())}.png"
    image_base64 = encode_image_to_base64(image_path)

    report_entry = {
        "FileName": filename,
        "ImageData": image_base64
    }

    collection.update_one(
        {"CardNumber": card_number},
        {
            "$push": {f"Reports.{disease_name}": report_entry},
            "$setOnInsert": {
                "CardNumber": card_number,
                "MedicalHistory": [],
                "Category": []
            }
        },
        upsert=True
    )
    print(f"Report for {disease_name} added for CardNumber {card_number}")

# Getting all Users

def get_all_users():
    user = session.query(User).filter_by(CardNumber="564783").first()
    print(f"CardNumber: {user.CardNumber}, UserName: {user.UserName}, "
              f"MobileNumber: {user.MobileNumber}, Email: {user.Email}, Status: {user.Status}")
        

# Getting all medical records

def get_all_medical_records():
    records = collection.find({"CardNumber": "564783"})
    for record in records:
        print(f"\nCardNumber: {record.get('CardNumber')}")
        print(f"MedicalHistory: {record.get('MedicalHistory')}")
        print(f"Category: {record.get('Category')}")
        print("Reports:")
        reports = record.get('Reports', {})
        for disease, entries in reports.items():
            print(f"  {disease}:")
            for entry in entries:
                print(f"    FileName: {entry['FileName']}")

def delete_sqlite_users_table():
    Base.metadata.drop_all(engine)
    print("SQLite table 'users' has been dropped.")

def delete_mongo_medical_records_collection():
    mongo_db.drop_collection("medical_records")
    print("MongoDB collection 'medical_records' has been dropped.")

# Example Usage
#register_new_user('564783', 'Aruna', '8142824676', 'john.doe@example.com', 'Active')
#add_user('564783', 'Aruna', '8142824676', 'john.doe@example.com', 'Active')
#insert_user_data_with_report('564783', 'Flu', '2025-04-01', 'reports/sample_image.png')

# View all user data
#print("\nAll Users in SQLite:")
#get_all_users()

# View all medical records
#print("\nAll Medical Records in MongoDB:")
#get_all_medical_records()

#delete_sqlite_users_table()
#delete_mongo_medical_records_collection()