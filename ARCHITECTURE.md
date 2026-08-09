# System Architecture & Documentation

## Chittagong Board Rank Checker

---

## 1. Project Overview

The **Chittagong Board Rank Checker** is a dual-purpose web application designed specifically for SSC '27 batch students under the Board of Intermediate and Secondary Education, Chittagong.

The platform serves two core objectives:
1. **Utility & Value Provision:** Provides students with instantaneous, precise board rank lookup based on academic performance data (GPA, Total Marks, and Core Subject Marks).
2. **High-Converting Promotional Engine:** Operates as a sleek, modern SaaS landing page designed to funnel student traffic directly into **Zahid's Chem Clinic (ZCC Foundation)** programs and chemistry courses.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Chittagong Board Rank Checker                    │
├────────────────────────────────────┬────────────────────────────────────┤
│           Student Utility          │         Promotional SaaS           │
│  • Instant Board Rank Lookup       │  • Course Showcase & Highlights    │
│  • Subject-wise Mark Analytics     │  • Zahid's Chem Clinic Conversion  │
│  • Instant Performance Breakdown   │  • High-Intent CTA & Enrollment    │
└────────────────────────────────────┴────────────────────────────────────┘
```

---

## 2. Tech Stack

The system leverages a decoupled modern web architecture featuring a responsive React single-page application (SPA) backed by a lightweight, scalable Express API and MongoDB database.

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) | Type-safe, component-driven UI library |
| **Frontend Build Tool** | [Vite](https://vitejs.dev/) | Next-generation frontend build tooling and fast HMR server |
| **Styling & Design** | [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework for modern responsive UI |
| **Backend Runtime** | [Node.js](https://nodejs.org/) | Event-driven asynchronous JavaScript runtime |
| **Backend Framework** | [Express.js](https://expressjs.com/) | Fast, unopinionated, minimalist web framework for Node.js |
| **Database ORM/ODM** | [Mongoose ODM](https://mongoosejs.com/) | Elegant MongoDB object modeling for Node.js |
| **Database** | [MongoDB](https://www.mongodb.com/) | High-performance NoSQL document database |

---

## 3. Frontend Architecture (UI/UX)

### 3.1 Design System & Theme
The application adopts a **"White SaaS Theme"** engineered for maximum visual clarity, trust, and premium conversion aesthetic.

- **Color Palette:** Dominated by crisp white (`bg-white`) paired with soft neutral slates (`bg-slate-50`, `bg-slate-100/50`) and subtle dark borders (`border-slate-200`).
- **Shadows & Depth:** Utilizes soft, layered drop shadows (`shadow-sm`, `shadow-xl shadow-slate-200/50`) to create floating cards and elevated UI elements without visually cluttering the viewport.
- **Accents:** High-contrast primary accents guide user focus towards rank inputs and course enrollment calls-to-action (CTAs).

### 3.2 Typography
- **Headings:** `'Outfit'` — An ultra-bold, geometric sans-serif typeface used for striking display headlines, numbers, and feature badges.
- **Body Text:** `'Plus Jakarta Sans'` — A clean, highly legible font optimized for form fields, tabular result data, and descriptive copy across device screen sizes.

### 3.3 Component Hierarchy
The frontend is modularized into reusable React components located in `Frontend/src/components/`:

```
Frontend/src/
├── components/
│   ├── Navbar.tsx        # Brand header with navigation links and ZCC enrollment CTA
│   ├── Hero.tsx          # Eye-catching banner introducing the board rank checker
│   ├── RankForm.tsx      # Interactive roll number input & validation form
│   ├── ResultCard.tsx    # Detailed student rank breakdown & mark display card
│   ├── PromoSection.tsx  # High-converting feature highlight for Zahid's Chem Clinic
│   └── Footer.tsx       # Copyright, quick links, and institutional info
```

| Component | File Path | Responsibilities |
| :--- | :--- | :--- |
| **Navbar** | [Navbar.tsx](file:///d:/ZCC%20Foundation/ctgboardrank/Frontend/src/components/Navbar.tsx) | Sticky navigation bar, brand logo, direct CTA link to Zahid's Chem Clinic. |
| **Hero** | [Hero.tsx](file:///d:/ZCC%20Foundation/ctgboardrank/Frontend/src/components/Hero.tsx) | Prominent hero copy, value proposition, and embedded form container. |
| **RankForm** | [RankForm.tsx](file:///d:/ZCC%20Foundation/ctgboardrank/Frontend/src/components/RankForm.tsx) | User input handler for SSC Roll, loading state trigger, and API fetch call. |
| **ResultCard** | [ResultCard.tsx](file:///d:/ZCC%20Foundation/ctgboardrank/Frontend/src/components/ResultCard.tsx) | Visual rendering of Board Rank, GPA, Total Marks, and subject breakdown. |
| **PromoSection** | [PromoSection.tsx](file:///d:/ZCC%20Foundation/ctgboardrank/Frontend/src/components/PromoSection.tsx) | Promotional section showcasing ZCC course offerings, testimonials, & funnel CTA. |
| **Footer** | [Footer.tsx](file:///d:/ZCC%20Foundation/ctgboardrank/Frontend/src/components/Footer.tsx) | Social links, copyright information, and developer credits. |

---

## 4. Backend & API Architecture

The backend follows a strict **Separation of Concerns (SoC)** architectural pattern, dividing responsibilities cleanly between configuration, route definition, and business logic execution.

```
backend/
├── server.js             # Main server entrypoint & middleware setup
└── src/
    ├── config/
    │   └── db.js         # MongoDB connection configuration via Mongoose
    ├── controllers/
    │   └── rankController.js # Core business logic & ranking calculation
    ├── models/
    │   └── Student.js    # Mongoose schema and data model definition
    └── routes/
        └── rankRoutes.js # REST API routing definitions
```

### 4.1 Separation of Concerns

- **`db.js`:** Encapsulates the MongoDB connection lifecycle utilizing Mongoose.
- **`rankRoutes.js`:** Maps HTTP route requests to dedicated controller functions.
- **`rankController.js`:** Handles incoming HTTP request parameters, queries the database, executes the ranking algorithm, and returns structured JSON responses.

### 4.2 RESTful API Endpoints

#### `GET /api/rank/:roll`

Retrieves the board rank and complete record for a specific student identified by their SSC Roll number.

* **URL Parameters:** `roll` (String, required)
* **Response Status Codes:**
  * `200 OK`: Student found successfully.
  * `404 Not Found`: No student record matching the roll number.
  * `500 Internal Server Error`: Server error or database query failure.

##### API Specification Table

| Method | Endpoint | Description | Request Params | Success Response (200 OK) |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/rank/:roll` | Fetch board rank & performance data | `roll` (e.g. `102030`) | JSON containing student details & computed `boardRank` |

##### Example Response Payloads

**Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "name": "Tanvir Hossain",
    "roll": "102030",
    "registration": "1812345678",
    "gpa": 5.00,
    "totalMarks": 1150,
    "coreSubjectMarks": 585,
    "boardRank": 14
  }
}
```

---

## 5. Database Schema & Core Algorithm

### 5.1 Mongoose Student Schema

The `Student` model schema structures all necessary academic credentials required for ranking evaluation:

| Field Name | Type | Options / Constraints | Description |
| :--- | :--- | :--- | :--- |
| `name` | `String` | Required, Trimmed | Full name of the student |
| `roll` | `String` | Required, Unique, Indexed | SSC Roll Number (Unique identifier) |
| `registration`| `String` | Required, Unique | SSC Registration Number |
| `gpa` | `Number` | Required, Min: 0.00, Max: 5.00 | Grade Point Average |
| `totalMarks` | `Number` | Required, Min: 0 | Sum of all marks obtained across all subjects |
| `coreSubjectMarks` | `Number` | Required, Min: 0 | Combined mark total in Physics, Chemistry, Math, & Biology |

### 5.2 Deterministic Ranking Algorithm

To determine an exact board rank without ambiguity or ties, the controller executes a three-tier hierarchical sorting tie-breaker:

$$\text{Rank Criteria Order: } \text{GPA} \searrow \text{Total Marks} \searrow \text{Core Subject Marks}$$

```
                          ┌──────────────────────────┐
                          │   Sort by GPA (Desc)     │
                          └────────────┬─────────────┘
                                       │ (If GPA is equal)
                          ┌────────────▼─────────────┐
                          │ Sort by TotalMarks (Desc)│
                          └────────────┬─────────────┘
                                       │ (If Total Marks are equal)
                          ┌────────────▼─────────────┐
                          │Sort by CoreSubjectMarks  │
                          │        (Desc)            │
                          └──────────────────────────┘
```

1. **Primary Sort Metric — GPA (Descending):** Students with higher overall GPAs (e.g. 5.00 vs 4.89) receive higher board ranks.
2. **Secondary Sort Metric — Total Marks (Descending):** When multiple students share the exact same GPA (e.g. multiple GPA 5.00 scorers), rank priority is assigned to the student with higher overall total marks.
3. **Tertiary Tie-Breaker — Core Subject Marks (Descending):** If both GPA and Total Marks are identical, rank priority is resolved by comparing total combined marks in core STEM subjects (Physics, Chemistry, Higher Math, Biology).

#### Execution in MongoDB Query Context
The rank calculation algorithm determines how many students precede the target student in the hierarchy:

$$\text{Board Rank} = 1 + \text{Count of students meeting any condition below:}$$

1. $\text{gpa} > \text{target.gpa}$
2. $\text{gpa} == \text{target.gpa} \land \text{totalMarks} > \text{target.totalMarks}$
3. $\text{gpa} == \text{target.gpa} \land \text{totalMarks} == \text{target.totalMarks} \land \text{coreSubjectMarks} > \text{target.coreSubjectMarks}$

---

## 6. Future Considerations (Security & Scaling)

On official SSC result publication days, the system may experience severe traffic surges (tens of thousands of concurrent requests within short windows). The following architectural measures are planned for scaling:

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Cloudflare  │ ──► │ Redis Cache  │ ──► │  Node/Express│ ──► │ MongoDB Read │
│  CDN & WAF   │     │  (Rank Cache)│     │ Cluster (PM2)│     │   Replicas   │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

1. **Redis Caching Layer:**
   - Pre-calculate top ranks or cache result objects by roll number in an in-memory Redis cache with TTL (Time-To-Live).
   - Serves sub-millisecond rank responses directly without touching the database during peak traffic spikes.

2. **Database Indexing & Read Replicas:**
   - Compound database indexes on `{ gpa: -1, totalMarks: -1, coreSubjectMarks: -1 }` and a unique index on `{ roll: 1 }` ensure $O(\log N)$ lookup performance.
   - Separate database read replicas to distribute query workload away from primary writer nodes.

3. **Rate Limiting & DDOS Protection:**
   - Integration of `express-rate-limit` middleware combined with Cloudflare Web Application Firewall (WAF) to prevent automated scrapers and abuse on result day.

4. **Static Page Edge Caching / CDN:**
   - Cache Vite static frontend assets across global CDN edge nodes to guarantee instant visual rendering regardless of user location.

---

*Document created for Chittagong Board Rank Checker — Zahid's Chem Clinic.*
