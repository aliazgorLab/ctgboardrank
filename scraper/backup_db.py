import os
import sys
import json
from bson import json_util

sys.path.append(os.path.dirname(__file__))
from database import get_db

def create_backup():
    print("=== CREATING MONGO BACKUP ===")
    backup_dir = os.path.join(os.path.dirname(__file__), "..", "backup_before_name_update")
    os.makedirs(backup_dir, exist_ok=True)

    db = get_db()
    
    # 1. Backup Students Collection
    print("Backing up 'students' collection...")
    students_cursor = db['students'].find()
    students_file = os.path.join(backup_dir, "students.json")
    with open(students_file, "w", encoding="utf-8") as f:
        count = 0
        for doc in students_cursor:
            f.write(json_util.dumps(doc) + "\n")
            count += 1
    print(f"✅ Saved {count} student records to {students_file}")

    # 2. Backup Institutions Collection
    print("Backing up 'institutions' collection...")
    inst_cursor = db['institutions'].find()
    inst_file = os.path.join(backup_dir, "institutions.json")
    with open(inst_file, "w", encoding="utf-8") as f:
        count = 0
        for doc in inst_cursor:
            f.write(json_util.dumps(doc) + "\n")
            count += 1
    print(f"✅ Saved {count} institution records to {inst_file}")

    print("=== BACKUP COMPLETED SUCCESSFULLY ===")

if __name__ == "__main__":
    create_backup()
