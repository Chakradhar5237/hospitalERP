from sqlalchemy import MetaData
from handleDatabaseConn import engine, Base, User, collection, mongo_db

def delete_user_table():
    # Drop the `users` table from the SQLITE database
    User.__table__.drop(engine)
    print("✅ 'users' table dropped successfully.")


def delete_user_collection():
    # Drop the `users` collection from the Mongo DB
    mongo_db.drop_collection("medical_records")
    print("MongoDB collection 'medical_records' has been dropped.")

if __name__ == "__main__":
    delete_user_table()
    delete_user_collection()
