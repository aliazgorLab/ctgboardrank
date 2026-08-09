import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# MongoDB Connection String from environment or local default
MONGO_URI = os.getenv(
    "MONGO_URI", 
    "mongodb+srv://aliazgor0810_db_user:cxK6sYOs7ifMKN2b@cluster0.k1oosck.mongodb.net/?appName=Cluster0"
)

client = None
db = None

def get_db():
    """Returns a connected PyMongo Database instance."""
    global client, db
    if client is None:
        try:
            client = MongoClient(MONGO_URI)
            db = client.get_default_database("ctgboardrank")
            print(f"[SUCCESS] PyMongo Connected to Database: {db.name}")
        except Exception as e:
            print(f"[ERROR] Database Connection Error: {e}")
            raise e
    return db

def upsert_student(student_data):
    """
    Upserts a student record into the 'students' collection based on roll number.
    Data format: { name, roll, registration, gpa, totalMarks, coreSubjectMarks }
    """
    try:
        database = get_db()
        collection = database["students"]

        roll_number = str(student_data.get("roll"))
        if not roll_number:
            print("[WARN] Skipped upsert: 'roll' is missing in student_data.")
            return False

        # Upsert: update matching roll or insert if new
        result = collection.update_one(
            {"roll": roll_number},
            {"$set": student_data},
            upsert=True
        )

        if result.upserted_id:
            print(f"[INSERTED] New student record for Roll #{roll_number} ({student_data.get('name')})")
        else:
            print(f"[UPDATED] Existing student record for Roll #{roll_number} ({student_data.get('name')})")
        return True

    except Exception as e:
        print(f"[ERROR] Error upserting student Roll #{student_data.get('roll')}: {e}")
        return False
