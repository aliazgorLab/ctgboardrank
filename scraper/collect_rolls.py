import os
import sys
import json
import time
import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
import pandas as pd
import requests
from bs4 import BeautifulSoup

POST_URL = "https://sresult.bise-ctg.gov.bd/to_ssc_26_ctg/resultm.php"
MAX_WORKERS = 15
TIMEOUT = 15
MAX_RETRIES = 3

def create_session():
    session = requests.Session()
    session.headers.update({
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://sresult.bise-ctg.gov.bd/to_ssc_26_ctg/"
    })
    return session

def parse_eiin_html(html, eiin_str):
    soup = BeautifulSoup(html, "html.parser")
    
    # 1. Extract Institution Name
    institution_name = ""
    for h in soup.find_all(["h2", "h3", "h4", "div", "b", "strong"]):
        text = h.get_text(strip=True)
        if eiin_str in text or "EIIN" in text:
            institution_name = text
            break
    
    if not institution_name:
        for t in soup.find_all("table"):
            text = t.get_text(strip=True)
            if eiin_str in text:
                institution_name = text.split("\n")[0][:100]
                break

    if not institution_name:
        institution_name = f"EIIN {eiin_str}"

    # 2. Extract Roll Numbers
    rolls = set()
    for row in soup.find_all("tr"):
        cells = [c.get_text(strip=True) for c in row.find_all(["td", "th"])]
        for cell in cells:
            if cell.isdigit() and len(cell) == 6:
                rolls.add(cell)

    results = []
    for r in sorted(list(rolls)):
        results.append({
            "eiin": str(eiin_str),
            "institution": institution_name,
            "roll": r
        })

    return results

def fetch_eiin_rolls(session, eiin_val):
    eiin_str = str(eiin_val).strip()
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            res = session.post(POST_URL, data={"eiin": eiin_str}, timeout=TIMEOUT)
            if res.status_code == 200:
                parsed_rolls = parse_eiin_html(res.text, eiin_str)
                if parsed_rolls:
                    return eiin_str, parsed_rolls, True
            time.sleep(0.3 * attempt)
        except Exception:
            time.sleep(0.5 * attempt)
    return eiin_str, [], False

def run_collector(test_eiin=None, force_refresh=False):
    eiin_csv_path = os.path.join(os.path.dirname(__file__), "eiin_list.csv")
    if not os.path.exists(eiin_csv_path):
        print(f"Error: EIIN CSV file not found at {eiin_csv_path}")
        return

    df = pd.read_csv(eiin_csv_path)
    col_name = [c for c in df.columns if c.lower() == 'eiin'][0] if any(c.lower() == 'eiin' for c in df.columns) else df.columns[0]
    all_eiins = [str(x).strip() for x in df[col_name].dropna().tolist()]

    if test_eiin:
        target_eiins = [str(test_eiin)]
        print(f"=== TESTING ROLL COLLECTOR FOR EIIN {test_eiin} ===")
    else:
        target_eiins = all_eiins
        print(f"=== RUNNING FULL ROLL COLLECTOR FOR {len(target_eiins)} EIINS ===")

    raw_rolls_path = os.path.join(os.path.dirname(__file__), "raw_rolls.json")
    logs_dir = os.path.join(os.path.dirname(__file__), "logs")
    os.makedirs(logs_dir, exist_ok=True)
    failed_log_path = os.path.join(logs_dir, "failed_collect_eiin.txt")

    # Resume support: load existing data if available
    collected_data = []
    processed_eiins = set()
    if not test_eiin and not force_refresh and os.path.exists(raw_rolls_path):
        try:
            with open(raw_rolls_path, "r", encoding="utf-8") as f:
                collected_data = json.load(f)
                processed_eiins = {item["eiin"] for item in collected_data}
            print(f"Resuming: Loaded {len(collected_data)} existing rolls across {len(processed_eiins)} EIINs.")
        except Exception:
            collected_data = []

    remaining_eiins = [e for e in target_eiins if e not in processed_eiins]
    print(f"EIINs remaining to process: {len(remaining_eiins)}")

    session = create_session()

    if test_eiin:
        eiin_str, rolls, success = fetch_eiin_rolls(session, test_eiin)
        if success:
            print("\n=========================================================")
            print(f"EIIN tested    : {eiin_str}")
            print(f"Rolls collected: {len(rolls)}")
            print("Sample output  :")
            print(json.dumps(rolls[:3], indent=2))
            print("=========================================================")
            with open(raw_rolls_path, "w", encoding="utf-8") as f:
                json.dump(rolls, f, indent=2)
        else:
            print(f"Failed to collect rolls for test EIIN {test_eiin}")
        return

    failed_eiins = []
    # Full batch run
    start_time = time.time()
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {executor.submit(fetch_eiin_rolls, session, e): e for e in remaining_eiins}
        for idx, future in enumerate(as_completed(futures), 1):
            eiin_str, rolls, success = future.result()
            if success and rolls:
                collected_data.extend(rolls)
                if idx % 50 == 0 or idx == len(remaining_eiins):
                    print(f"[{idx}/{len(remaining_eiins)}] EIIN {eiin_str} | Rolls: {len(rolls)} | Total: {len(collected_data)}")
            else:
                failed_eiins.append(eiin_str)
                with open(failed_log_path, "a", encoding="utf-8") as f:
                    f.write(f"{eiin_str}\n")
                print(f"[{idx}/{len(remaining_eiins)}] EIIN {eiin_str} | Failed")

            # Save progress incrementally every 50 EIINs
            if idx % 50 == 0 or idx == len(remaining_eiins):
                with open(raw_rolls_path, "w", encoding="utf-8") as f:
                    json.dump(collected_data, f, indent=2)

    elapsed = time.time() - start_time
    all_rolls = [item["roll"] for item in collected_data]
    unique_rolls = set(all_rolls)
    duplicate_count = len(all_rolls) - len(unique_rolls)

    print("\n=========================================================")
    print("ROLL COLLECTION METRICS")
    print("=========================================================")
    print(f"Total EIIN Processed : {len(target_eiins)}")
    print(f"Total Rolls Collected: {len(collected_data)}")
    print(f"Unique Rolls Count   : {len(unique_rolls)}")
    print(f"Duplicate Rolls      : {duplicate_count}")
    print(f"Failed EIIN Count    : {len(failed_eiins)}")
    if failed_eiins:
        print(f"Failed EIIN List     : {failed_eiins}")
    print(f"Time Elapsed         : {elapsed:.2f} seconds")
    print(f"Saved to             : {raw_rolls_path}")
    print("=========================================================")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Collect SSC 2026 examinee roll numbers from EIIN portal")
    parser.add_argument("--test", type=str, help="Test with single EIIN (e.g. 104245)")
    parser.add_argument("--full", action="store_true", help="Run full migration across all EIINs")
    parser.add_argument("--force", action="store_true", help="Force fresh collection ignoring existing raw_rolls.json")
    args = parser.parse_args()

    if args.full or args.force:
        run_collector(force_refresh=True)
    elif args.test:
        run_collector(test_eiin=args.test)
    else:
        run_collector(force_refresh=args.force)
