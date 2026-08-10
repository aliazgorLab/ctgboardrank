import os
import json
from database import get_db, upsert_institution, upsert_students

TEST_EIIN = "104245"
JSON_FILE = os.path.join(os.path.dirname(__file__), "test_output.json")

def test_mongodb_integration():
    print("=========================================================")
    print(f"Testing MongoDB Integration for EIIN: {TEST_EIIN}")
    print("=========================================================")

    if not os.path.exists(JSON_FILE):
        print(f"[ERROR] Test output file not found: {JSON_FILE}")
        print("Please run test_eiin.py first.")
        return False

    with open(JSON_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    inst_summary = data.get("institution_summary", {})
    students = data.get("students", [])

    print(f"[LOADED] Loaded {len(students)} students for Institution: {inst_summary.get('institution')}")

    # 1. Upsert Institution
    inst_success = upsert_institution(inst_summary)
    print(f"[INSTITUTION UPSERT] Result: {'SUCCESS' if inst_success else 'FAILED'}")

    # 2. Bulk Upsert Students
    upserted_cnt, modified_cnt, total_ops = upsert_students(students)
    print(f"[STUDENTS BULK UPSERT] Operations: {total_ops} | Upserted New: {upserted_cnt} | Modified: {modified_cnt}")

    # 3. Query Database Verification
    db = get_db()
    institutions_col = db["institutions"]
    students_col = db["students"]

    inst_count = institutions_col.count_documents({"eiin": TEST_EIIN})
    student_count = students_col.count_documents({"eiin": TEST_EIIN})

    print("\n--- DATABASE VERIFICATION REPORT ---")
    print(f"Institutions matching EIIN {TEST_EIIN} : {inst_count} (Expected: 1)")
    print(f"Students matching EIIN {TEST_EIIN}     : {student_count} (Expected: 83)")

    # 4. Fetch sample document directly from MongoDB
    sample_doc = students_col.find_one({"eiin": TEST_EIIN})
    if sample_doc:
        sample_doc.pop("_id", None)
        print("\n--- SAMPLE STUDENT MONGODB DOCUMENT ---")
        print(json.dumps(sample_doc, indent=2))

    if inst_count == 1 and student_count == 83:
        print("\n[VERIFICATION PASSED] MongoDB Integration Test Successful!")
        return True
    else:
        print("\n[VERIFICATION FAILED] Count mismatch detected.")
        return False

if __name__ == "__main__":
    test_mongodb_integration()
