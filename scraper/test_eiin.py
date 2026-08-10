import os
import json
import requests
from parser import parse_student_results, parse_institution_info

TARGET_URL = "https://sresult.bise-ctg.gov.bd/to_ssc_26_ctg/resultm.php"
TEST_EIIN = "104245"
HTML_OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "test_output.html")
JSON_OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "test_output.json")

def test_single_eiin(eiin=TEST_EIIN):
    print("=========================================================")
    print(f"Testing EIIN Result Fetcher & Parser for EIIN: {eiin}")
    print("=========================================================")

    session = requests.Session()
    session.headers.update({
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded"
    })

    payload = {"eiin": str(eiin)}
    print(f"[REQUEST] POST {TARGET_URL} | Payload: {payload}")
    
    try:
        response = session.post(TARGET_URL, data=payload, timeout=15)
        print(f"[RESPONSE] HTTP Status: {response.status_code}")

        if response.status_code != 200:
            print(f"[ERROR] Failed to fetch data. HTTP Status: {response.status_code}")
            return False

        html_content = response.text

        # 1. Save raw HTML to test_output.html
        with open(HTML_OUTPUT_PATH, "w", encoding="utf-8") as f:
            f.write(html_content)
        print(f"[SAVED] Raw HTML written to: {HTML_OUTPUT_PATH}")

        # 2. Parse institution & student data using parser module
        inst_info, students = parse_student_results(html_content, default_eiin=eiin)

        # 3. Output parsed dataset into test_output.json
        output_data = {
            "institution_summary": inst_info,
            "total_parsed_students": len(students),
            "students": students
        }

        with open(JSON_OUTPUT_PATH, "w", encoding="utf-8") as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False)
        print(f"[SAVED] Parsed JSON output written to: {JSON_OUTPUT_PATH}")

        # 4. Print Summary to Console
        print("\n--- INSTITUTION SUMMARY ---")
        print(f"EIIN             : {inst_info['eiin']}")
        print(f"Institution Name : {inst_info['institution']}")
        print(f"Zilla            : {inst_info['zilla']}")
        print(f"Thana            : {inst_info['thana']}")
        print(f"Appeared         : {inst_info['appeared']}")
        print(f"Passed           : {inst_info['passed']}")
        print(f"Pass Percentage  : {inst_info['passPercentage']}%")
        print(f"GPA 5.00 Count   : {inst_info['gpa5Count']}")
        print(f"Total Students   : {len(students)}")

        print("\n--- SAMPLE PASSED STUDENT DATA ---")
        if students:
            print(json.dumps(students[0], indent=2))

        failed_sample = next((s for s in students if s["gpa"] == 0.0), None)
        if failed_sample:
            print("\n--- SAMPLE FAILED STUDENT DATA ---")
            print(json.dumps(failed_sample, indent=2))

        return True

    except Exception as e:
        print(f"[EXCEPT] Error during test execution: {e}")
        return False

if __name__ == "__main__":
    test_single_eiin()
