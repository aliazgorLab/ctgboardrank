import os
import json
from parser import GROUP_CORE_SUBJECT_MAP, SUBJECT_NAMES

JSON_FILE = os.path.join(os.path.dirname(__file__), "test_output.json")

def validate_parser():
    if not os.path.exists(JSON_FILE):
        print(f"[ERROR] {JSON_FILE} not found. Please run test_eiin.py first.")
        return

    with open(JSON_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    students = data.get("students", [])
    print(f"Total students loaded from test_output.json: {len(students)}\n")

    # Pick samples from each group
    groups = ["Science", "Business Studies", "Humanities"]
    
    for group_name in groups:
        group_students = [s for s in students if s.get("group") == group_name and s.get("gpa") > 0]
        if not group_students:
            print(f"=== GROUP: {group_name} (No passed students found) ===\n")
            continue

        sample_student = group_students[0]
        roll = sample_student.get("roll")
        gpa = sample_student.get("gpa")
        calculated_core = sample_student.get("coreSubjectMarks")
        subjects = sample_student.get("subjects", {})
        core_codes = GROUP_CORE_SUBJECT_MAP.get(group_name, set())

        print(f"=========================================================")
        print(f"GROUP: {group_name.upper()} | Sample Examinee Roll: #{roll} (GPA: {gpa})")
        print(f"=========================================================")
        print(f"1. Student Roll          : {roll}")
        print(f"2. Group                 : {group_name}")
        print(f"3. Calculated Core Marks : {calculated_core}")
        print(f"4. Subject Marks Used for Core Calculation:")

        recalculated_sum = 0
        for code, mark in subjects.items():
            if code in core_codes:
                subj_name = SUBJECT_NAMES.get(code, f"Subject {code}")
                print(f"   - Code {code} ({subj_name}): {mark} marks")
                recalculated_sum += mark

        print(f"   -----------------------------------------------------")
        print(f"   Recalculated Sum Check: {recalculated_sum} (Matches Calculated Core: {recalculated_sum == calculated_core})\n")

if __name__ == "__main__":
    validate_parser()
