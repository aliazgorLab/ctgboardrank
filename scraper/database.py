import os
from dotenv import load_dotenv
from pymongo import MongoClient, UpdateOne, ASCENDING, DESCENDING

# Load environment variables from backend/.env or root/local .env
env_backend = os.path.join(os.path.dirname(__file__), "..", "backend", ".env")
if os.path.exists(env_backend):
    load_dotenv(env_backend)
else:
    load_dotenv()

MONGO_URI = os.getenv(
    "MONGO_URI",
    "mongodb+srv://aliazgor0810_db_user:cxK6sYOs7ifMKN2b@cluster0.k1oosck.mongodb.net/?appName=Cluster0"
)

_client = None
_db = None
_indexes_initialized = False

def get_db():
    """Returns PyMongo Database instance and ensures required collection indexes exist."""
    global _client, _db, _indexes_initialized
    if _client is None:
        try:
            _client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=10000)
            _db = _client.get_database("ctgboardrank")
            print(f"[MONGO] Connected to database: {_db.name}")
        except Exception as e:
            print(f"[MONGO ERROR] Database connection failed: {e}")
            raise e

    if not _indexes_initialized and _db is not None:
        init_indexes(_db)
        _indexes_initialized = True

    return _db


def init_indexes(db):
    """Verifies and creates compound unique & ranking indexes on 'students' and 'institutions' collections."""
    try:
        students_col = db["students"]
        institutions_col = db["institutions"]

        # Drop legacy single-field roll_1 unique index if present to avoid cross-institution roll collision
        try:
            existing_student_indexes = [idx["name"] for idx in students_col.list_indexes()]
            if "roll_1" in existing_student_indexes:
                students_col.drop_index("roll_1")
                print("[MONGO] Dropped legacy single-field index 'roll_1'.")
        except Exception:
            pass

        # 1. students: Compound unique index (roll + eiin + year + board)
        try:
            students_col.create_index(
                [
                    ("roll", ASCENDING),
                    ("eiin", ASCENDING),
                    ("year", ASCENDING),
                    ("board", ASCENDING)
                ],
                unique=True,
                name="roll_eiin_year_board_unique",
                background=True
            )
        except Exception:
            pass

        # 2. students: Compound ranking index for leaderboards
        try:
            students_col.create_index(
                [
                    ("group", DESCENDING),
                    ("gpa", DESCENDING),
                    ("totalMarks", DESCENDING),
                    ("coreSubjectMarks", DESCENDING)
                ],
                name="group_gpa_total_core_index",
                background=True
            )
        except Exception:
            pass

        # 3. institutions: eiin unique index
        try:
            institutions_col.create_index(
                [("eiin", ASCENDING)],
                unique=True,
                name="eiin_unique",
                background=True
            )
        except Exception:
            pass

        print("[MONGO] Indexes verified on 'students' and 'institutions'.")
    except Exception as e:
        print(f"[MONGO WARN] Index verification: {e}")


def upsert_institution(inst_info):
    """
    Upserts institution summary info into 'institutions' collection.
    Format: { eiin, name, district, thana, appeared, passed, passPercentage, gpa5 }
    """
    if not inst_info or not inst_info.get("eiin"):
        return False

    db = get_db()
    collection = db["institutions"]

    eiin_str = str(inst_info.get("eiin", "")).strip()
    doc = {
        "eiin": eiin_str,
        "name": inst_info.get("institution", ""),
        "district": inst_info.get("zilla", ""),
        "thana": inst_info.get("thana", ""),
        "appeared": int(inst_info.get("appeared", 0)),
        "passed": int(inst_info.get("passed", 0)),
        "passPercentage": float(inst_info.get("passPercentage", 0.0)),
        "gpa5": int(inst_info.get("gpa5Count", 0))
    }

    try:
        collection.update_one({"eiin": eiin_str}, {"$set": doc}, upsert=True)
        return True
    except Exception as e:
        print(f"[MONGO ERROR] Error upserting institution {eiin_str}: {e}")
        return False


def upsert_students(students_list):
    """
    Bulk upserts a list of student dicts into 'students' collection based on compound key (roll + eiin + year + board).
    Returns (upserted_count, modified_count, total_operations).
    """
    if not students_list:
        return 0, 0, 0

    db = get_db()
    collection = db["students"]

    operations = []
    for s in students_list:
        roll_num = str(s.get("roll", "")).strip()
        eiin_str = str(s.get("eiin", "")).strip()
        if not roll_num or not eiin_str:
            continue
        
        doc = {
            "roll": roll_num,
            "name": "",
            "registration": "",
            "eiin": eiin_str,
            "institution": s.get("institution", ""),
            "group": s.get("group", "Science"),
            "gpa": float(s.get("gpa", 0.0)),
            "totalMarks": int(s.get("totalMarks", 0)),
            "coreSubjectMarks": int(s.get("coreSubjectMarks", 0)),
            "subjects": s.get("subjects", {}),
            "year": 2026,
            "board": "Chittagong"
        }
        
        filter_query = {
            "roll": roll_num,
            "eiin": eiin_str,
            "year": 2026,
            "board": "Chittagong"
        }
        
        operations.append(
            UpdateOne(filter_query, {"$set": doc}, upsert=True)
        )

    if not operations:
        return 0, 0, 0

    try:
        result = collection.bulk_write(operations, ordered=False)
        upserted_cnt = result.upserted_count
        modified_cnt = result.modified_count
        return upserted_cnt, modified_cnt, len(operations)
    except Exception as e:
        print(f"[MONGO ERROR] Bulk upsert error: {e}")
        return 0, 0, 0
