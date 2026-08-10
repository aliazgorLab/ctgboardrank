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
            time.sleep(0.2 * attempt)
        except Exception:
            time.sleep(0.3 * attempt)
    return str(roll), "", False

def run_migration(test_mode=False):
    db = get_db()

    total_in_db = db["students"].count_documents({"roll": {"$exists": True}})
    query = {"$or": [{"name": ""}, {"name": {"$exists": False}}]}
    unnamed_docs = list(db["students"].find(query, {"_id": 1, "roll": 1}))

    print("=========================================================")
    print("SSC 2026 OFFICIAL STUDENT NAME MIGRATION")
    print("=========================================================")
    print(f"Total Roll Numbers Collected from DB : {total_in_db}")
    print(f"Remaining Empty Names to Fetch      : {len(unnamed_docs)}")
    print("=========================================================")

    if len(unnamed_docs) == 0:
        print("✅ All student names are already populated!")
        return

    if test_mode:
        unnamed_docs = unnamed_docs[:10]
        print(f"\n--- RUNNING 10 TEST ROLLS ---")
    else:
        print(f"\n--- STARTING FULL MIGRATION RUN ({MAX_WORKERS} WORKERS) ---")

    rolls = [doc["roll"] for doc in unnamed_docs]

    logs_dir = os.path.join(os.path.dirname(__file__), "logs")
    os.makedirs(logs_dir, exist_ok=True)
    failed_log_path = os.path.join(logs_dir, "failed_rolls.txt")

    updated_count = 0
    failed_count = 0
    bulk_ops = []

    start_time = time.time()
    session = create_session()

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {executor.submit(fetch_student_name, session, roll): roll for roll in rolls}
        
        for idx, future in enumerate(as_completed(futures), 1):
            roll, name, success = future.result()
            
            if success and name:
                bulk_ops.append(
                    UpdateOne(
                        {"roll": roll},
                        {"$set": {"name": name}}
                    )
                )
                updated_count += 1
                if test_mode or idx <= 10 or idx % 200 == 0 or idx == len(rolls):
                    print(f"[{idx}/{len(rolls)}]\nRoll:\n{roll}\nName:\n{name}\nStatus:\nUPDATED\n")
            else:
                failed_count += 1
                with open(failed_log_path, "a", encoding="utf-8") as f:
                    f.write(f"{roll}\n")
                if test_mode or idx <= 10:
                    print(f"[{idx}/{len(rolls)}]\nRoll:\n{roll}\nStatus:\nFAILED_FETCH\n")

            # Execute bulk write in batches
            if len(bulk_ops) >= BATCH_SIZE or idx == len(rolls):
                if bulk_ops:
                    db["students"].bulk_write(bulk_ops, ordered=False)
                    bulk_ops = []

    elapsed = time.time() - start_time
    total_named = db["students"].count_documents({"name": {"$ne": ""}})
    remaining_empty = db["students"].count_documents({"name": ""})

    print("=========================================================")
    print("SSC 2026 STUDENT NAME MIGRATION BATCH COMPLETE")
    print("=========================================================")
    print(f"Total Students       : {total_in_db}")
    print(f"Names Updated Batch  : {updated_count}")
    print(f"Failed Batch Count   : {failed_count}")
    print(f"Total Named in DB    : {total_named}")
    print(f"Empty Names Remaining: {remaining_empty}")
    print(f"Time Elapsed         : {elapsed:.2f} seconds")
    print("=========================================================")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Fetch official student names from BISE result portal")
    parser.add_argument("--test", action="store_true", help="Run 10 test rolls")
    args = parser.parse_args()

    run_migration(test_mode=args.test)
