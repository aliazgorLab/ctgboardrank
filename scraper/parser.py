import re
from bs4 import BeautifulSoup

# Subject name lookup dictionary for clean reporting and validation
SUBJECT_NAMES = {
    "101": "Bangla",
    "107": "English",
    "109": "Mathematics",
    "110": "Geography & Environment",
    "111": "Islam & Moral Education",
    "112": "Hindu Religion & Moral Education",
    "113": "Buddhist Religion",
    "126": "Higher Mathematics",
    "127": "General Science",
    "134": "Agriculture Studies",
    "136": "Physics",
    "137": "Chemistry",
    "138": "Biology",
    "140": "Civics & Citizenship",
    "143": "Business Entrepreneurship",
    "146": "Accounting",
    "150": "ICT",
    "152": "Finance & Banking",
    "153": "Economics",
    "154": "Physical Education"
}

# Group-specific core subject code mappings for ranking tie-breakers
GROUP_CORE_SUBJECT_MAP = {
    "Science": {"109", "126", "136", "137", "138", "150"},          # Math (109), Higher Math (126), Physics (136), Chemistry (137), Biology (138), ICT (150)
    "Business Studies": {"109", "127", "146", "152", "143", "150"}, # Math (109), Gen Science (127), Accounting (146), Finance (152), Business Ent (143), ICT (150)
    "Humanities": {"109", "127", "110", "140", "153", "150"}        # Math (109), Gen Science (127), Geography (110), Civics (140), Economics (153), ICT (150)
}

def parse_institution_info(html_content, default_eiin=""):
    """
    Parses summary table metadata from institution result HTML page.
    Returns a dict with institution details.
    """
    soup = BeautifulSoup(html_content, 'html.parser')
    
    inst_name = ""
    zilla = ""
    thana = ""
    appeared = 0
    passed = 0
    pass_pct = 0.0
    gpa5 = 0
    eiin = str(default_eiin)

    table = soup.find('table')
    if table:
        for tr in table.find_all('tr'):
            tds = [td.text.strip() for td in tr.find_all(['td', 'th'])]
            if len(tds) >= 2:
                lbl = tds[0].upper()
                val = tds[1]
                if 'INSTITUTE NAME' in lbl:
                    inst_name = val
                    eiin_match = re.search(r'\((\d{6})\)', val)
                    if eiin_match:
                        eiin = eiin_match.group(1)
                elif 'ZILLA' in lbl:
                    zilla = val
                elif 'THANA' in lbl:
                    thana = val
                elif 'APP' in lbl:
                    try: appeared = int(val)
                    except ValueError: pass
                elif 'PASS' in lbl:
                    try: passed = int(val)
                    except ValueError: pass
                elif 'PERCENT' in lbl:
                    try: pass_pct = float(val.replace('%', '').strip())
                    except ValueError: pass
                elif 'GPA5' in lbl:
                    try: gpa5 = int(val)
                    except ValueError: pass

    return {
        "eiin": eiin,
        "institution": inst_name,
        "zilla": zilla,
        "thana": thana,
        "appeared": appeared,
        "passed": passed,
        "passPercentage": pass_pct,
        "gpa5Count": gpa5
    }


def parse_student_results(html_content, default_eiin=""):
    """
    Parses individual student roll numbers, GPAs, group stream, total marks, 
    group-specific core subject marks, and subject-wise mark mapping.
    Returns a tuple of (inst_info, students_list).
    """
    inst_info = parse_institution_info(html_content, default_eiin=default_eiin)
    eiin = inst_info["eiin"] or str(default_eiin)
    inst_name = inst_info["institution"]

    soup = BeautifulSoup(html_content, 'html.parser')
    
    container = None
    for div in soup.find_all('div'):
        div_text = div.text.upper()
        if 'EXAMINEES SECURING' in div_text or 'ALL RESULTS' in div_text:
            container = div
            break
    if not container:
        container = soup

    raw_html = str(container)
    lines = [l.strip() for l in re.split(r'<br\s*/?>', raw_html, flags=re.IGNORECASE) if l.strip()]

    current_group = "Science"
    students = []
    seen_rolls = set()

    for line in lines:
        clean_line = BeautifulSoup(line, 'html.parser').get_text().strip()
        if not clean_line:
            continue
        
        line_upper = clean_line.upper()

        # Group detection strictly from section headings
        if 'SCIENCE' in line_upper and 'BUSINESS' not in line_upper and 'HUMANITIES' not in line_upper:
            current_group = "Science"
        elif 'BUSINESS STUDIES' in line_upper:
            current_group = "Business Studies"
        elif 'HUMANITIES' in line_upper:
            current_group = "Humanities"

        # Passed examinee entry: Roll[GPA]:Code:T:Marks(Grade),...
        match_pass = re.search(r'^(\d{6})\[(\d+\.\d{2})\]:(.+)$', clean_line)
        if match_pass:
            roll = match_pass.group(1)
            if roll in seen_rolls:
                continue
            
            gpa = float(match_pass.group(2))
            subj_str = match_pass.group(3)
            
            subjects = {}
            total_marks = 0
            core_marks = 0
            
            core_codes = GROUP_CORE_SUBJECT_MAP.get(current_group, GROUP_CORE_SUBJECT_MAP["Science"])

            for item in subj_str.split(','):
                item = item.strip()
                # Match format: 101:T:172(A+) or 109:T:071(A )
                pm = re.match(r'^(\d{3}):[A-Z]+:(\d{1,3})\(([^)]+)\)$', item)
                if pm:
                    code = pm.group(1)
                    mark = int(pm.group(2))
                    subjects[code] = mark
                    total_marks += mark
                    if code in core_codes:
                        core_marks += mark
            
            students.append({
                "roll": roll,
                "registration": "",
                "name": "",
                "eiin": eiin,
                "institution": inst_name,
                "group": current_group,
                "gpa": gpa,
                "totalMarks": total_marks,
                "coreSubjectMarks": core_marks,
                "subjects": subjects
            })
            seen_rolls.add(roll)
            continue

        # Unsuccessful/failed examinee entries: Roll[F1], Roll[F2], etc.
        if 'UNSUCCESSFUL' in line_upper or 'OTHERS' in line_upper or '[F' in clean_line:
            failed_matches = re.findall(r'(\d{6})\[F\d+\]', clean_line)
            for r in failed_matches:
                if r not in seen_rolls:
                    students.append({
                        "roll": r,
                        "registration": "",
                        "name": "",
                        "eiin": eiin,
                        "institution": inst_name,
                        "group": current_group,
                        "gpa": 0.00,
                        "totalMarks": 0,
                        "coreSubjectMarks": 0,
                        "subjects": {}
                    })
                    seen_rolls.add(r)

    return inst_info, students
