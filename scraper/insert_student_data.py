import os
import sys
import json
import time
from pymongo import UpdateOne, ASCENDING, DESCENDING
from pymongo.errors import BulkWriteError

sys.path.append(os.path.dirname(__file__))
from database import get_db

def validate_student_doc(doc):
    if not isinstance(doc, dict):
        return False, "Not a dictionary"
    
    roll = str(doc.get("roll", "")).strip()
    name = str(doc.get("name", "")).strip()
    institution = str(doc.get("institution", "")).strip()
    group = str(doc.get("group", "")).strip()
    gpa = doc.get("gpa")
    total_marks = doc.get("totalMarks")

    if not roll or not roll.isdigit():
        return False, "Invalid or missing roll"
    if not name:
        return False, "Missing name"
    if not institution:
        return False, "Missing institution"
    if not group:
        return False, "Missing group"
    if gpa is None or not isinstance(gpa, (int, float)):
        return False, "Invalid GPA"
    if total_marks is None or not isinstance(total_marks, (int, float)) or total_marks <= 0:
        return False, "Invalid totalMarks"

    return True, "Valid"

def run_insertion():
    details_file = os.path.join(os.path.dirname(__file__), "student_details.json")
    if not os.path.exists(details_file):
        print(f"Error: {details_file} not found. Running database verification on current records instead.")
        db = get_db()
        total_cnt = db["students"].count_documents({})
        empty_cnt = db["students"].count_documents({"name": ""})
        print(f"Total Students in DB : {total_cnt}")
        print(f"Empty Names Count    : {empty_cnt}")
        return

    with open(details_file, "r", encoding="utf-8") as f:
        student_records = json.load(f)

    print(f"Loaded {len(student_records)} examinee records from student_details.json.")

    valid_docs = []
    rejected_count = 0

    for doc in student_records:
        is_valid, reason = validate_student_doc(doc)
        if is_valid:
            valid_docs.append(doc)
        else:
            rejected_count += 1

    print(f"Validation: {len(valid_docs)} valid records, {rejected_count} rejected incomplete records.")

    db = get_db()

    # Ensure indexes
    print("Verifying MongoDB indexes on 'students' collection...")
    db["students"].create_index([("roll", ASCENDING)], unique=True, name="roll_unique")
    db["students"].create_index(
        [
            ("group", DESCENDING),
            ("gpa", DESCENDING),
            ("totalMarks", DESCENDING),
            ("coreSubjectMarks", DESCENDING)
        ],
        name="group_gpa_total_core_index"
    )

    bulk_ops = []
    inserted_count = 0
    duplicate_count = 0
    failed_count = 0

    batch_size = 1000

    for idx, doc in enumerate(valid_docs, 1):
        bulk_ops.append(
            UpdateOne(
                {"roll": doc["roll"]},
                {"$set": doc},
                upsert=True
            )
        )

        if len(bulk_ops) >= batch_size or idx == len(valid_docs):
            try:
                res = db["students"].bulk_write(bulk_ops, ordered=False)
                inserted_count += (res.upserted_count + res.modified_count)
            except BulkWriteError as bwe:
                write_errors = bwe.details.get("writeErrors", [])
                for err in write_errors:
                    if err.get("code") == 11000:
                        duplicate_count += 1
                    else:
                        failed_count += 1
            bulk_ops = []

    total_in_db = db["students"].count_documents({})
    empty_names_count = db["students"].count_documents({"name": ""})

    print("\n=========================================================")
    print("STUDENT DATA INSERTION REPORT")
    print("=========================================================")
    print(f"Total Input Records  : {len(student_records)}")
    print(f"Valid Records        : {len(valid_docs)}")
    print(f"Rejected Records     : {rejected_count}")
    print(f"Total Inserted/Upserted : {inserted_count}")
    print(f"Duplicate Count      : {duplicate_count}")
    print(f"Failed Count         : {failed_count}")
    print(f"Total Students in DB : {total_in_db}")
    print(f"Empty Names in DB    : {empty_names_count}")
    print("=========================================================")

if __name__ == "__main__":
    run_insertion()
