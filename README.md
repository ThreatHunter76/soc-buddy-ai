# 🛡️ SOC Buddy AI

An AI-powered Security Operations Center (SOC) Assistant built with FastAPI, PostgreSQL, JWT Authentication, and OpenAI.

SOC Buddy AI helps SOC analysts manage security incidents, authenticate users securely, and leverage AI to analyze incidents and provide actionable recommendations.

---

# 🚀 Features

- 🔐 JWT Authentication
- 👤 User Registration & Login
- 🛡️ Protected API Endpoints
- 📋 Incident Management (Create, Read, Update, Delete)
- 🤖 AI-Powered Incident Analysis
- 📊 RESTful API Documentation (Swagger UI)
- 🗄️ PostgreSQL Database
- 🔑 Secure Password Hashing (bcrypt)
- ⚡ FastAPI Backend
- 🔄 Graceful AI Fallback when OpenAI API is unavailable

---

# 🏗️ Tech Stack

## Backend

- FastAPI
- SQLAlchemy
- PostgreSQL
- Alembic
- Pydantic
- JWT Authentication
- Passlib (bcrypt)
- OpenAI API

## Development Tools

- Python
- VS Code
- Git
- GitHub
- Swagger UI

---

# 📂 Project Structure

```
soc-buddy-ai/
│
├── backend/
│   ├── alembic/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── .env
│
├── README.md
└── .gitignore
```

---

# 📌 API Endpoints

## Authentication

- Register User
- Login
- JWT Authentication

## Users

- Get Users

## Incidents

- Create Incident
- Get Incidents
- Analyze Incident (AI)

---

# 🤖 AI Analysis

SOC Buddy AI uses the OpenAI API to generate:

- Incident Summary
- Severity Assessment
- MITRE ATT&CK Technique Mapping
- Recommended Remediation Steps

If the OpenAI API is unavailable, the application returns a fallback SOC analyst response.

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/ThreatHunter76/soc-buddy-ai.git
```

Go into the project

```bash
cd soc-buddy-ai/backend
```

Create a virtual environment

```bash
python -m venv .venv
```

Activate it

Windows

```bash
.venv\Scripts\activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run the application

```bash
python -m uvicorn app.main:app --reload
```

Open Swagger

```
http://127.0.0.1:8000/docs
```

---

# 📸 Screenshots

Coming soon after frontend development.

---

# 🔮 Roadmap

- ✅ FastAPI Backend
- ✅ PostgreSQL Integration
- ✅ JWT Authentication
- ✅ AI Incident Analysis
- ✅ GitHub Integration
- ⏳ Next.js Frontend
- ⏳ Dashboard
- ⏳ User Profile
- ⏳ Charts & Analytics
- ⏳ Incident Timeline
- ⏳ SOC Dashboard

---

# 👨‍💻 Author

**AbdulQudus AbdulHakeem**

GitHub:
https://github.com/ThreatHunter76

LinkedIn:
(Coming Soon)

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.