import os
import re
import time
import random
from bs4 import BeautifulSoup

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

from db_handler import upsert_student

# Configuration Options
HEADLESS_MODE = True  # Set to False if you want to watch the Chrome browser UI
TARGET_URL = "http://www.educationboardresults.gov.bd/"

# ---------------------------------------------------------------------------
# Result Day Placeholder Configurable Selectors & Keywords
# (Update these constants after inspecting the live result HTML layout)
# ---------------------------------------------------------------------------
NAME_LABELS = ["Name of Student", "Student Name", "Name"]
ROLL_LABELS = ["Roll No", "Roll Number", "Roll"]
REG_LABELS = ["Reg. No", "Registration No", "Reg No"]
GPA_LABELS = ["GPA", "Result"]

# Keywords to match core STEM subjects for tie-breaker calculations
CORE_SUBJECT_KEYWORDS = [
    "PHYSICS",
    "CHEMISTRY",
    "HIGHER MATHEMATICS",
    "BIOLOGY",
    "MATHEMATICS",
]

# Common Chrome binary locations on Windows
CHROME_PATHS = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    os.path.expanduser(r"~\AppData\Local\Google\Chrome\Application\chrome.exe"),
]


def find_chrome_binary():
    """Returns the path to chrome.exe if installed on the system."""
    for path in CHROME_PATHS:
        if os.path.exists(path):
            return path
    return None


def init_driver(headless=HEADLESS_MODE):
    """Initializes and returns a Selenium Chrome WebDriver with options."""
    options = webdriver.ChromeOptions()
    if headless:
        options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36")

    chrome_path = find_chrome_binary()
    if chrome_path:
        options.binary_location = chrome_path
        print(f"[INFO] Using Chrome binary at: {chrome_path}")

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    driver.implicitly_wait(8)
    return driver


def solve_math_captcha(driver):
    """
    Extracts the math captcha string from the <td> element (e.g. '9 + 2'),
    evaluates the arithmetic sum, and returns the calculated integer as string.
    """
    try:
        captcha_element = WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.XPATH, "//td[contains(text(), '+')]"))
        )
        text = captcha_element.text.strip()
        
        # Extract numbers in format: 'X + Y'
        match = re.search(r'(\d+)\s*\+\s*(\d+)', text)
        if match:
            num1, num2 = int(match.group(1)), int(match.group(2))
            result = num1 + num2
            print(f"[CAPTCHA] Solved Captcha: {num1} + {num2} = {result}")
            return str(result)
        else:
            print(f"[WARN] Could not parse captcha math expression from text: '{text}'")
            return None
    except Exception as e:
        print(f"[ERROR] Error locating/solving captcha: {e}")
        return None


def parse_result_page(html, roll="", reg=""):
    """
    Parses raw HTML source of official SSC result page to extract student info,
    GPA, subject-wise marks breakdown, total marks, and core subject marks.
    
    Returns a dictionary:
    {
        "name": str,
        "roll": str,
        "registration": str,
        "gpa": float,
        "subjects": dict,
        "totalMarks": int,
        "coreSubjectMarks": int
    }
    """
    soup = BeautifulSoup(html, "html.parser")

    name = None
    extracted_roll = str(roll) if roll else None
    extracted_reg = str(reg) if reg else None
    gpa = None
    subjects = {}
    total_marks = 0
    core_subject_marks = 0

    # 1. Extract Student Profile Info from Table Rows
    for tr in soup.find_all("tr"):
        tds = tr.find_all(["td", "th"])
        if len(tds) < 2:
            continue

        label = tds[0].text.strip()
        val = tds[1].text.strip()

        if any(lbl.lower() in label.lower() for lbl in NAME_LABELS) and not name:
            name = val
        elif any(lbl.lower() in label.lower() for lbl in ROLL_LABELS) and not extracted_roll:
            extracted_roll = val
        elif any(lbl.lower() in label.lower() for lbl in REG_LABELS) and not extracted_reg:
            extracted_reg = val
        elif any(lbl.lower() in label.lower() for lbl in GPA_LABELS) and gpa is None:
            gpa_match = re.search(r'\d+\.\d+', val)
            if gpa_match:
                gpa = float(gpa_match.group(0))

    # Fallbacks if unparsed
    if not name:
        name = f"Examinee ({extracted_roll or 'Unknown'})"
    if gpa is None:
        gpa = 0.00

    # 2. Extract Subject Marks Table
    all_labels = [l.lower() for l in NAME_LABELS + ROLL_LABELS + REG_LABELS + GPA_LABELS]
    for tr in soup.find_all("tr"):
        tds = tr.find_all(["td", "th"])
        if len(tds) >= 2:
            subject_name = tds[0].text.strip()
            mark_text = tds[1].text.strip()

            # Skip header rows or profile summary rows
            if any(lbl in subject_name.lower() for lbl in all_labels):
                continue

            mark_match = re.search(r'\b\d{1,3}\b', mark_text)
            if mark_match and len(subject_name) > 2:
                mark_val = int(mark_match.group(0))
                subjects[subject_name] = mark_val
                total_marks += mark_val

                if any(core.lower() in subject_name.lower() for core in CORE_SUBJECT_KEYWORDS):
                    core_subject_marks += mark_val

    return {
        "name": name,
        "roll": str(extracted_roll or roll),
        "registration": str(extracted_reg or reg),
        "gpa": float(gpa),
        "subjects": subjects,
        "totalMarks": total_marks,
        "coreSubjectMarks": core_subject_marks,
    }


def scrape_student_result(roll, reg, driver):
    """
    Automates extraction of result for a given Roll and Reg number
    from educationboardresults.gov.bd and saves to MongoDB.
    """
    try:
        print(f"\n[FETCH] Processing Roll #{roll} | Reg #{reg}...")
        driver.get(TARGET_URL)

        # Wait for form to load
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.NAME, "exam"))
        )

        # Select Examination: SSC/Dakhil/Equivalent ('ssc')
        exam_select = Select(driver.find_element(By.NAME, "exam"))
        exam_select.select_by_value("ssc")

        # Select Year: '2026' (or fallback to latest option if 2026 isn't listed)
        year_select = Select(driver.find_element(By.NAME, "year"))
        try:
            year_select.select_by_value("2026")
        except Exception:
            year_select.select_by_index(1)

        # Select Board: Chittagong ('chittagong')
        board_select = Select(driver.find_element(By.NAME, "board"))
        board_select.select_by_value("chittagong")

        # Enter Roll & Registration
        roll_input = driver.find_element(By.NAME, "roll")
        reg_input = driver.find_element(By.NAME, "reg")

        roll_input.clear()
        roll_input.send_keys(str(roll))
        reg_input.clear()
        reg_input.send_keys(str(reg))

        # Solve Captcha & Fill Answer
        captcha_ans = solve_math_captcha(driver)
        if not captcha_ans:
            print("[ERROR] Captcha solving failed. Skipping roll.")
            return False

        captcha_input = driver.find_element(By.NAME, "value_s")
        captcha_input.clear()
        captcha_input.send_keys(captcha_ans)

        # Submit Form
        submit_btn = driver.find_element(By.NAME, "button2")
        submit_btn.click()

        # Wait for Result Table to load
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "table"))
        )

        # Parse Page HTML Source using parse_result_page
        html_source = driver.page_source
        extracted_data = parse_result_page(html_source, roll=roll, reg=reg)

        print(f"[EXTRACTED] Name: {extracted_data['name']} | GPA: {extracted_data['gpa']} | Total Marks: {extracted_data['totalMarks']}")

        # Send to MongoDB Pipeline via db_handler
        success = upsert_student(extracted_data)
        return success

    except Exception as e:
        print(f"[ERROR] Error scraping Roll #{roll}: {e}")
        return False


def main():
    print("=========================================================")
    print("Chittagong SSC Result Scraper & MongoDB Pipeline")
    print("=========================================================")

    batch_students = [
        {"roll": "102938", "reg": "2110482910"},
        {"roll": "109842", "reg": "2110482911"},
        {"roll": "104821", "reg": "2110482913"},
        {"roll": "106543", "reg": "2110482918"},
        {"roll": "107123", "reg": "2110482914"},
    ]

    try:
        driver = init_driver(headless=HEADLESS_MODE)
    except Exception as err:
        print(f"[WARN] Chrome WebDriver initialization skipped: {err}")
        print("[INFO] Fallback: Direct MongoDB Pipeline is active via seed.js or HTTP mode.")
        return

    try:
        for idx, student in enumerate(batch_students, 1):
            scrape_student_result(student["roll"], student["reg"], driver)

            if idx < len(batch_students):
                sleep_time = random.uniform(2.0, 5.0)
                print(f"[WAIT] Sleeping {sleep_time:.2f}s before next request...")
                time.sleep(sleep_time)

    finally:
        driver.quit()
        print("\n[DONE] Scraper process completed.")


if __name__ == "__main__":
    main()
