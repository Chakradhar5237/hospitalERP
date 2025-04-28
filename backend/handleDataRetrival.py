from handleDatabaseConn import session, User, collection

def get_all_users():
    users = session.query(User).all()
    for user in users:
        print(f"CardNumber: {user.CardNumber}, UserName: {user.UserName}, "
              f"MobileNumber: {user.MobileNumber}, Email: {user.Email}, Status: {user.Status}, "
              f"DateOfBirth: {user.DateOfBirth}, ProfileImageBase64: {user.ProfileImageBase64}, ")


def get_all_medical_records():
    records = collection.find()
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


get_all_users()
get_all_medical_records()