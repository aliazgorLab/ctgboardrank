import os
import csv
import sys
import time
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

from parser import parse_student_results
from database import get_db, upsert_institution, upsert_students

TARGET_URL = "https://sresult.bise-ctg.gov.bd/to_ssc_26_ctg/resultm.php"
EIIN_CSV_PATH = os.path.join(os.path.dirname(__file__), "eiin_list.csv")
LOG_DIR = os.path.join(os.path.dirname(__file__), "logs")
FAILED_LOG_PATH = os.path.join(LOG_DIR, "failed_eiin.txt")

TEST_EIINS = ["104245", "103086", "103087", "103088"]

MAX_WORKERS = 10
TIMEOUT_SECONDS = 15
MAX_RETRIES = 3

lock = threading.Lock()
completed_count = 0
failed_eiins = []


def ensure_log_dir():
    """Creates the logs directory if it does not exist."""
    if not os.path.exists(LOG_DIR):
        os.makedirs(LOG_DIR, exist_ok=True)


def create_http_session():
    """Creates a requests.Session with connection pooling and retry strategy."""
    session = requests.Session()
    retry_strategy = Retry(
        total=MAX_RETRIES,
        backoff_factor=1,
        status_forcelist=[429, 500, 502, 503, 504],
        raise_on_status=False
    )
    adapter = HTTPAdapter(
        max_retries=retry_strategy,
        pool_connections=MAX_WORKERS,
        pool_maxsize=MAX_WORKERS * 2
    )
    session.mount("https://", adapter)
    session.mount("http://", adapter)
    session.headers.update({
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded"
    })
    return session


def load_eiin_list(full_mode=False):
    """Loads EIIN numbers from eiin_list.csv or returns test list."""
    if not full_mode:
        print("[MODE] Test Mode active. Processing initial test batch:", TEST_EIINS)
        return TEST_EIINS

    eiin_list = []
    if os.path.exists(EIIN_CSV_PATH):
        with open(EIIN_CSV_PATH, "r", encoding="utf-8") as f:
            reader = csv.reader(f)
            header = next(reader, None)
            for row in reader:
                if row and row[0].strip().isdigit():
                    eiin_list.append(row[0].strip())
        print(f"[MODE] Full Scrape Mode active. Loaded {len(eiin_list)} EIINs from CSV.")
    else:
        print(f"[ERROR] CSV file not found at {EIIN_CSV_PATH}. Falling back to test list.")
        eiin_list = TEST_EIINS
    return eiin_list


def process_single_eiin(eiin, total_count, session):
    """Processes a single EIIN: fetches HTML, parses metrics, and upserts to MongoDB."""
    global completed_count
    eiin_str = str(eiin).strip()
    payload = {"eiin": eiin_str}

    success = False
    html_content = ""

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            resp = session.post(TARGET_URL, data=payload, timeout=TIMEOUT_SECONDS)
            if resp.status_code == 200 and "INSTITUTE NAME" in resp.text:
                html_content = resp.text
                success = True
                break
            elif resp.status_code == 302 or "location: index.php" in resp.text:
                # EIIN not found or invalid
                break
        except Exception:
            if attempt < MAX_RETRIES:
                time.sleep(1)

    with lock:
        completed_count += 1
        current_idx = completed_count

    if not success or not html_content:
        with lock:
            failed_eiins.append(eiin_str)
            with open(FAILED_LOG_PATH, "a", encoding="utf-8") as f:
                f.write(f"{eiin_str}\n")
        print(f"[{current_idx}/{total_count}] EIIN {eiin_str} | Failed")
        return False, 0

    try:
        inst_info, students_list = parse_student_results(html_content, default_eiin=eiin_str)
        
        # Save to MongoDB
        upsert_institution(inst_info)
        upsert_students(students_list)

        student_cnt = len(students_list)
        print(f"[{current_idx}/{total_count}] EIIN {eiin_str} | Students: {student_cnt} | Saved")
        return True, student_cnt

    except Exception as e:
        with lock:
            failed_eiins.append(eiin_str)
            with open(FAILED_LOG_PATH, "a", encoding="utf-8") as f:
                f.write(f"{eiin_str}\n")
        print(f"[{current_idx}/{total_count}] EIIN {eiin_str} | Parsing Error: {e} | Failed")
        return False, 0


def run_scraper(full_mode=False):
    global completed_count, failed_eiins
    completed_count = 0
    failed_eiins = []

    ensure_log_dir()

    print("=========================================================")
    print("Chittagong Board SSC 2026 EIIN Result Scraper")
    print("=========================================================")

    # Initialize MongoDB connection & verify indexes
    get_db()

    eiin_list = load_eiin_list(full_mode=full_mode)
    total_total = len(eiin_list)

    session = create_http_session()

    start_time = time.time()
    total_saved_students = 0

    print(f"\n[START] Scraping {total_total} EIINs using {MAX_WORKERS} concurrent threads...\n")

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = [
            executor.submit(process_single_eiin, eiin, total_total, session)
            for eiin in eiin_list
        ]
        for future in as_completed(futures):
            ok, cnt = future.result()
            if ok:
                total_saved_students += cnt

    elapsed = time.time() - start_time

    print("\n=========================================================")
    print("SCRAPING SUMMARY")
    print("=========================================================")
    print(f"Total EIINs Processed : {completed_count}/{total_total}")
    print(f"Total Students Saved  : {total_saved_students}")
    print(f"Failed EIINs Count    : {len(failed_eiins)}")
    if failed_eiins:
        print(f"Failed EIINs List     : {failed_eiins}")
        print(f"Failed EIIN Log File  : {FAILED_LOG_PATH}")
    print(f"Total Time Elapsed    : {elapsed:.2f} seconds")
    print("=========================================================\n")


if __name__ == "__main__":
    full_mode = "--all" in sys.argv or "--full" in sys.argv
    run_scraper(full_mode=full_mode)
