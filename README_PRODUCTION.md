# CTG Board Rank SSC 2026 — Production Documentation

Official production documentation and deployment guide for the **Chittagong Board SSC 2026 Merit Ranking Platform**.

---

## 🚀 Architecture Overview

* **Frontend**: React 18 + Vite + TailwindCSS + Lucide Icons (Deployed on Vercel: `https://ctgboardrank.vercel.app`)
* **Backend**: Node.js + Express + Mongoose + Helmet + CORS + Rate Limiter (Deployed on Render: `https://ctgboardrank.onrender.com`)
* **Database**: MongoDB Atlas (`ctgboardrank`)
* **Scraper Engine**: Python Async/Multithreaded HTTP pipeline (`requests.Session` + `BeautifulSoup4` + `PyMongo`)

---

## 📊 Production Dataset Summary

* **Database**: MongoDB Atlas (`ctgboardrank`)
* **Total Institutions Processed**: 1,287
* **Institutions Saved**: 1,218
* **Examinees Saved**: 141,418 records
* **Database Compound Unique Index**: `roll` + `eiin` + `year` + `board`
* **Database Leaderboard Compound Index**: `group` + `gpa` + `totalMarks` + `coreSubjectMarks`

---

## 🔗 Production Endpoints

### 1. Health Check
```http
GET /api/health
```
Response:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-08-10T13:25:00.000Z"
}
```

### 2. Examinee Rank Lookup
```http
GET /api/rank/:roll
```
Example: `GET /api/rank/132254`
Response:
```json
{
  "name": "",
  "roll": "132254",
  "registration": "",
  "gpa": 5,
  "achievement": "Golden GPA 5",
  "totalMarks": 1047,
  "coreSubjectMarks": 544,
  "group": "Science",
  "institution": "T. S. P. COMPLEX SECONDARY SCHOOL(104245)",
  "boardRank": 1,
  "totalStudents": "142,000+"
}
```

### 3. Board Leaderboard
```http
GET /api/rank/leaderboard?limit=100&group=Science
```

---

## 🛠 Database Backup & Maintenance

### Automated Scraping Pipeline
To re-run or refresh institution data:
```bash
# Test Mode (4 Institutions)
python scraper/scraper.py

# Full Production Mode (All 1287 Institutions)
python scraper/scraper.py --all
```

### Database Backup Plan
```bash
mongodump --uri="mongodb+srv://<user>:<password>@cluster0.k1oosck.mongodb.net/ctgboardrank" --out=./backup/
```

---

## 🟢 Production Status

* **Security**: Helmet, CORS restricted, 200 req/15min Rate Limiting.
* **Error Handling**: Graceful fallback UI for empty examinee names and network errors.
* **Status**: **LIVE & PRODUCTION READY**
