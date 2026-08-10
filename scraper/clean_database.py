from database import get_db

def clean_database():
    print("=========================================================")
    print("MongoDB Database Cleanup Utility")
    print("=========================================================")

    db = get_db()
    students_col = db["students"]
    institutions_col = db["institutions"]

    res_students = students_col.delete_many({})
    res_institutions = institutions_col.delete_many({})

    print("\nDatabase cleanup completed\n")
    print(f"Deleted Students: {res_students.deleted_count}")
    print(f"Deleted Institutions: {res_institutions.deleted_count}")
    print("=========================================================\n")

if __name__ == "__main__":
    clean_database()
