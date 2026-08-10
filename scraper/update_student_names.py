import os
import sys
import time
import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests
from bs4 import BeautifulSoup
from pymongo import UpdateOne

sys.path.append(os.path.dirname(__file__))
from database import get_db

POST_URL = "https://sresult.bise-ctg.gov.bd/to_ssc_26_ctg/individual/result.php"
MAX_WORKERS = 20
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

def extract_name(html):
    soup = BeautifulSoup(html, "html.parser")
    for row in soup.find_all("tr"):
        cells = [c.get_text(strip=True) for c in row.find_all(["td", "th"])]
        for idx, text in enumerate(cells):
            if text.lower() == "name" and idx + 1 < len(cells):
                name_val = cells[idx + 1].strip()
                if name_val and name_val.lower() != "name":
                    return name_val
    return ""

def fetch_student_name(session, roll):
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            res = session.post(POST_URL, data={"roll": str(roll)}, timeout=TIMEOUT)
            if res.status_code == 200:
                name = extract_name(res.text)
                if name:
                    return str(roll), name, True
            time.sleep(0.3 * attempt)
        except Exception:
            time.sleep(0.5 * attempt)
    return str(roll), "", False

def run_update(test_mode=False):
    db = get_db()

    # Query students where name is empty
    query = {"$or": [{"name": ""}, {"name": {"$exists": False}}]}
    
    total_unnamed = db["students"].count_documents(query)
    print(f"Total examinees requiring name update: {total_unnamed}")

    if total_unnamed == 0:
        print("All examinee names are already populated!")
        return

    if test_mode:
        students = list(db["students"].find(query).limit(10))
        print(f"\n--- RUNNING TEST MODE ON {len(students)} EXAMINEES ---")
    else:
        # Fetch roll list
        students = list(db["students"].find(query, {"roll": 1}))
        print(f"\n--- RUNNING PRODUCTION SCRAPE ON {len(students)} EXAMINEES ---")

    rolls = [s["roll"] for s in students]

    logs_dir = os.path.join(os.path.dirname(__file__), "logs")
    os.makedirs(logs_dir, exist_ok=True)
    failed_log_path = os.path.join(logs_dir, "failed_names.txt")

    updated_count = 0
    failed_count = 0
    bulk_ops = []

    start_time = time.time()
    session = create_session()

    print(f"Starting name update pipeline ({MAX_WORKERS} threads)...")

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {executor.submit(fetch_student_name, session, roll): roll for roll in rolls}
        
        for idx, future in enumerate(as_completed(futures), 1):
            roll, name, success = future.result()
            
            if success and name:
                bulk_ops.append(
                    UpdateOne(
                        {"roll": roll, "name": ""},
                        {"$set": {"name": name}}
                    )
                )
                updated_count += 1
                if test_mode or idx <= 10 or idx % 500 == 0 or idx == len(rolls):
                    print(f"[{idx}/{len(rolls)}] Roll:{roll} | Name:{name} | Updated")
            else:
                failed_count += 1
                with open(failed_log_path, "a", encoding="utf-8") as f:
                    f.write(f"{roll}\n")
                if test_mode or idx <= 10:
                    print(f"[{idx}/{len(rolls)}] Roll:{roll} | Failed to fetch name")

            # Execute bulk write in batches
            if len(bulk_ops) >= BATCH_SIZE or idx == len(rolls):
                if bulk_ops:
                    db["students"].bulk_write(bulk_ops, ordered=False)
                    bulk_ops = []

    elapsed = time.time() - start_time
    remaining_empty = db["students"].count_documents({"name": ""})

    print("\n=========================================================")
    print("NAME UPDATE SUMMARY")
    print("=========================================================")
    print(f"Total Rolls Processed : {len(rolls)}")
    print(f"Names Updated         : {updated_count}")
    print(f"Failed Fetch Count    : {failed_count}")
    print(f"Empty Names Remaining : {remaining_empty}")
    print(f"Total Time Elapsed    : {elapsed:.2f} seconds")
    print("=========================================================")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Update examinee names from official result portal")
    parser.add_argument("--test", action="store_true", help="Run in test mode on 10 examinees")
    args = parser.parse_args()

    run_update(test_mode=args.test)
