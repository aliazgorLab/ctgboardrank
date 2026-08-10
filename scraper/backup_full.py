import os
import sys
import json
from bson import json_util

sys.path.append(os.path.dirname(__file__))
from database import get_db

def create_full_backup():
    print("=== CREATING FULL MONGODB BACKUP BEFORE SCRAPE ===")
    backup_dir = os.path.join(os.path.dirname(__file__), "..", "backup_before_full_scrape")
    os.makedirs(backup_dir, exist_ok=True)

    db = get_db()

    # 1. Backup Students Collection
    print("Backing up 'students' collection...")
    students_cursor = db["students"].find()
    students_file = os.path.join(backup_dir, "students_backup.json")
    students_count = 0
    with open(students_file, "w", encoding="utf-8") as f:
        for doc in students_cursor:
            f.write(json_util.dumps(doc) + "\n")
            students_count += 1

    # 2. Backup Institutions Collection
    print("Backing up 'institutions' collection...")
    inst_cursor = db["institutions"].find()
    inst_file = os.path.join(backup_dir, "institutions_backup.json")
    inst_count = 0
    with open(inst_file, "w", encoding="utf-8") as f:
        for doc in inst_cursor:
            f.write(json_util.dumps(doc) + "\n")
            inst_count += 1

    print("\n=========================================================")
    print("BACKUP COMPLETED")
    print("=========================================================")
    print(f"Students Backup Count    : {students_count}")
    print(f"Institutions Backup Count : {inst_count}")
    print(f"Backup Directory Location: {os.path.abspath(backup_dir)}")
    print("=========================================================")
    print("DO NOT DELETE STUDENTS COLLECTION YET. AWAITING APPROVAL.")

if __name__ == "__main__":
    create_full_backup()
