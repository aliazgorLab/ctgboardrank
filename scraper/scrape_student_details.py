import os
import sys
import re
import json
import time
import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests
from bs4 import BeautifulSoup
from pymongo import UpdateOne

sys.path.append(os.path.dirname(__file__))
from database import get_db

POST_URL = "https://sresult.bise-ctg.gov.bd/to_ssc_26_ctg/individual/result.php"
MAX_WORKERS = 30
BATCH_SIZE = 500
TIMEOUT = 15
MAX_RETRIES = 3

def create_session():
    session = requests.Session()
    session.headers.update({
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://sresult.bise-ctg.gov.bd/to_ssc_26_ctg/individual/"
    })
    return session

def parse_student_detail_html(html, target_roll):
    soup = BeautifulSoup(html, "html.parser")
    meta = {}
    
    # 1. Parse Metadata Table
    for table in soup.find_all("table", class_="tftable"):
        for row in table.find_all("tr"):
            cells = [c.get_text(strip=True) for c in row.find_all(["td", "th"])]
            for i in range(0, len(cells), 2):
                if i + 1 < len(cells):
                    key = cells[i].lower().replace(".", "").replace("'", "").strip()
                    val = cells[i + 1].strip()
                    meta[key] = val

    roll = meta.get("roll no") or str(target_roll)
    name = meta.get("name") or ""
    reg = meta.get("reg no") or meta.get("reg") or ""
    group_raw = meta.get("group") or "Science"
    group = "Science"
    if "business" in group_raw.lower():
        group = "Business Studies"
    elif "humanities" in group_raw.lower():
        group = "Humanities"

    institution = meta.get("institute") or ""

    # GPA parsing
    result_str = meta.get("result") or ""
    gpa = 0.0
    gpa_match = re.search(r"GPA\s*=\s*([\d\.]+)", result_str, re.IGNORECASE)
    if gpa_match:
        gpa = float(gpa_match.group(1))

    # 2. Parse Subject Marks Table
    subjects = {}
    total_marks = 0

    for table in soup.find_all("table", class_="tftable2"):
        for row in table.find_all("tr"):
            cells = [c.get_text(strip=True) for c in row.find_all(["td", "th"])]
            if len(cells) == 3 and cells[0].isdigit():
                code_str = cells[0]
                mark_cell = cells[2]
                mark_match = re.search(r"^(\d+)", mark_cell)
                if mark_match:
                    mark_val = int(mark_match.group(1))
                    code_int = int(code_str)
                    subjects[str(code_int)] = mark_val
                    if code_int not in [147, 156]:
                        total_marks += mark_val

    # 3. Calculate Core Subject Marks
    core_subject_marks = 0
    if group == "Science":
        core_codes = ["109", "136", "137", "126", "138", "154"]
    elif group == "Business Studies":
        core_codes = ["109", "127", "146", "152", "143", "154"]
    else: # Humanities
        core_codes = ["109", "127", "110", "153", "140", "154"]

    for code in core_codes:
        core_subject_marks += subjects.get(code, 0)

    # Extract EIIN from institution string if present, e.g. "COLLEGIATE SCHOOL (104275)"
    eiin = ""
    eiin_match = re.search(r"\((\d{6})\)", institution)
    if eiin_match:
        eiin = eiin_match.group(1)

    return {
        "roll": roll,
        "name": name,
        "registration": reg,
        "eiin": eiin,
        "institution": institution,
        "group": group,
        "gpa": gpa,
        "totalMarks": total_marks,
        "coreSubjectMarks": core_subject_marks,
        "subjects": subjects,
        "year": 2026,
        "board": "Chittagong"
    }

def fetch_student_detail(session, roll_val, default_eiin="", default_inst=""):
    roll_str = str(roll_val).strip()
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            res = session.post(POST_URL, data={"roll": roll_str}, timeout=TIMEOUT)
            if res.status_code == 200:
                parsed = parse_student_detail_html(res.text, roll_str)
                if parsed.get("name") and parsed.get("roll"):
                    if not parsed.get("eiin") and default_eiin:
                        parsed["eiin"] = default_eiin
                    if not parsed.get("institution") and default_inst:
                        parsed["institution"] = default_inst
                    return roll_str, parsed, True
            time.sleep(0.3 * attempt)
        except Exception:
            time.sleep(0.5 * attempt)
    return roll_str, None, False

def run_detail_scraper(test_mode=False):
    raw_rolls_path = os.path.join(os.path.dirname(__file__), "raw_rolls.json")
    if not os.path.exists(raw_rolls_path):
        print(f"Error: raw_rolls.json not found at {raw_rolls_path}")
        return

    with open(raw_rolls_path, "r", encoding="utf-8") as f:
        raw_items = json.load(f)

    db = get_db()

    # Resume support: find rolls already saved in MongoDB ctgboardrank.students
    existing_rolls = set(db["students"].distinct("roll"))
    print(f"Loaded {len(raw_items)} rolls from raw_rolls.json. Existing in DB: {len(existing_rolls)}")

    remaining_items = [item for item in raw_items if item["roll"] not in existing_rolls]
    print(f"Remaining rolls to scrape details for: {len(remaining_items)}")

    if test_mode:
        remaining_items = raw_items[:20]
        print(f"\n--- TESTING SCRAPER ON 20 ROLLS ---")
    else:
        print(f"\n--- RUNNING FULL DETAIL SCRAPER FOR {len(remaining_items)} ROLLS ({MAX_WORKERS} WORKERS) ---")

    logs_dir = os.path.join(os.path.dirname(__file__), "logs")
    os.makedirs(logs_dir, exist_ok=True)
    failed_log_path = os.path.join(logs_dir, "failed_detail_rolls.txt")

    session = create_session()
    bulk_ops = []
    success_count = 0
    failed_count = 0

    start_time = time.time()

    scraped_records = []
    student_details_path = os.path.join(os.path.dirname(__file__), "student_details.json")

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {
            executor.submit(
                fetch_student_detail, session, item["roll"], item.get("eiin", ""), item.get("institution", "")
            ): item for item in remaining_items
        }

        for idx, future in enumerate(as_completed(futures), 1):
            roll, detail, success = future.result()
            
            if success and detail:
                success_count += 1
                scraped_records.append(detail)
                bulk_ops.append(
                    UpdateOne(
                        {"roll": roll},
                        {"$set": detail},
                        upsert=True
                    )
                )
                if test_mode or idx <= 5 or idx % 200 == 0 or idx == len(remaining_items):
                    print(f"[{idx}/{len(remaining_items)}] Roll:{roll} | Name:{detail['name']} | GPA:{detail['gpa']} | Marks:{detail['totalMarks']}")
            else:
                failed_count += 1
                with open(failed_log_path, "a", encoding="utf-8") as f:
                    f.write(f"{roll}\n")
                if test_mode or idx <= 5:
                    print(f"[{idx}/{len(remaining_items)}] Roll:{roll} | Failed to scrape detail")

            # Execute bulk write in batches
            if len(bulk_ops) >= BATCH_SIZE or idx == len(remaining_items):
                if bulk_ops:
                    db["students"].bulk_write(bulk_ops, ordered=False)
                    bulk_ops = []

    # Save to student_details.json
    if scraped_records:
        with open(student_details_path, "w", encoding="utf-8") as f:
            json.dump(scraped_records, f, indent=2)
        print(f"Saved {len(scraped_records)} records to {student_details_path}")

    elapsed = time.time() - start_time
    total_db_students = db["students"].count_documents({})

    print("\n=========================================================")
    print("STUDENT DETAIL SCRAPER SUMMARY")
    print("=========================================================")
    print(f"Total Rolls Tested/Scraped: {len(remaining_items)}")
    print(f"Success Count             : {success_count}")
    print(f"Failed Count              : {failed_count}")
    print(f"Total Students in DB      : {total_db_students}")
    print(f"Time Elapsed              : {elapsed:.2f} seconds")
    print("=========================================================")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Scrape full student details from official BISE portal")
    parser.add_argument("--test", action="store_true", help="Test with 20 rolls")
    args = parser.parse_args()

    run_detail_scraper(test_mode=args.test)
