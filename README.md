# 🛡️ ShieldReport: Speak Without Fear

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B%20%7C%2020%2B%20%7C%2024%2B-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2%2B-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-38B2AC.svg)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748.svg)](https://www.prisma.io/)
[![Security: AES--256--GCM](https://img.shields.io/badge/Encryption-AES--256--GCM-success.svg)](https://en.wikipedia.org/wiki/Galois/Counter_Mode)
[![AI Engine](https://img.shields.io/badge/AI%20Triage-OpenAI%20GPT--4o-orange.svg)](https://openai.com/)

> **ShieldReport** is a zero-knowledge, mathematically anonymous whistleblower and incident reporting platform. Designed to solve systemic failure points in enterprise compliance, it pairs pre-routing identity stripping and AES-256-GCM data encryption with GPT-4o triage and forensic NLP analysis.

---

## 📑 Table of Contents

- [Vision \& Problem Statement](#-vision--problem-statement)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Setup](#environment-setup)
  - [Database Initialization \& Seeding](#database-initialization--seeding)
  - [Running the Application](#running-the-application)
- [Demo Credentials](#-demo-credentials)
- [API Reference](#-api-reference)
- [Security \& Anonymity Proofs](#-security--anonymity-proofs)
- [Deployment](#-deployment)
- [License](#-license)

---

## 🎯 Vision & Problem Statement

Conventional corporate hotlines and web portals often fail whistleblowers due to:
1. **Network & Device Fingerprinting**: Web servers routinely record IP addresses, proxy headers (`x-forwarded-for`), browser user-agents, and cookies.
2. **Account Retaliation**: Requiring employee accounts or email verification creates direct avenues for corporate retaliation.
3. **Investigation Bottlenecks**: High report volume combined with spam or unstructured entries delays response to critical safety or ethics hazards.

**ShieldReport completely eliminates these vulnerabilities by design:**
- **No Accounts Required**: Whistleblowers authenticate only with a stateless, cryptographic 12-character Case Token (`SHR-XXXX-XXXX`).
- **Violent Metadata Stripping**: Incoming network metadata (IP, forwarded headers, user-agents) is expunged before controller logic or database models ever execute.
- **Zero-Knowledge Encryption**: Incident records are encrypted at rest with AES-256-GCM. Even in a catastrophic database breach, data remains unreadable.
- **AI-Powered Triage & Forensic NLP**: GPT-4o rapidly scores urgency, extracts tags, and detects spam/fraud probability so investigators can prioritize critical issues immediately.

---

## 🚀 Key Features

### 1. 🛡️ Architectural Zero-Knowledge Anonymity
* **Pre-Routing Metadata Stripping**: Custom Express middleware actively sets `req.ip = '0.0.0.0'` and purges `x-forwarded-for`, `x-real-ip`, and `user-agent` before reaching any controller logic.
* **No Telemetry or Fingerprinting**: Zero tracking cookies, zero analytics scripts, locally served fonts, and no reporter local-storage tokens.
* **Cryptographic Case Tokens**: Reporters track case progression, view status changes, and communicate anonymously using a randomized 12-character token (e.g., `SHR-4B9X-21PL`).

### 2. 🔐 Military-Grade Data-at-Rest Encryption (AES-256-GCM)
* Every report narrative is locked using a high-entropy 256-bit encryption key.
* Generates a unique cryptographically secure 16-byte Initialization Vector (IV) and 64-byte salt per write operation.
* GCM authentication tags guarantee integrity and prevent ciphertext manipulation.

### 3. 🤖 Dual-Engine AI Triage & Forensic Analysis
* **OpenAI GPT-4o Urgency Scoring**: Evaluates reports on a 0–100 scale, extracts categorical tags, and synthesizes an executive summary for rapid investigator triage.
* **Forensic NLP Fraud & Credibility Analysis**: Evaluates linguistic cues to calculate **Fraud Probability** and **Witness Credibility** scores, surfacing forensic reasoning to assist compliance teams in identifying frivolous or malicious submissions.

### 4. 👁️ Computer Vision (CV) Evidence & Tamper Verification
* Analyzes uploaded evidence attachments for authenticity and manipulation indicators.
* Generates SHA-256 cryptographic hashes for chain-of-custody verification.
* Built-in investigator manual approval workflow (`PENDING_MANUAL_APPROVAL`, `APPROVED`, `REJECTED`) with reviewer audit notes.

### 5. 📅 Structured Incident Schedule Generator
* Enables reporters to construct structured incident timelines and recurrence schedules (e.g., ongoing, specific dates, multi-phase incidents) stored cleanly for investigative timelines.

### 6. 💬 Bidirectional Anonymous Encrypted Messenger
* Secure asynchronous chat channel enabling investigators and submitters to exchange follow-up questions and status updates without deanonymizing the reporter.

### 7. 🍎 Apple Cupertino "Liquid Glass" UI/UX
* Designed with frosted glass aesthetics, backdrop blurs, fluid Framer Motion transitions, responsive dark mode, and an intuitive multi-step reporting wizard.

### 8. 🌐 Internationalization (i18n)
* Built-in multi-language localization (English, Spanish, French, German, Hindi) powered by `react-i18next` for seamless global deployment.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph Reporter["Whistleblower Client (React / Vite)"]
        UI["Cupertino Liquid Glass UI"]
        WIZ["Multi-Step Wizard + i18n"]
        EVD["Evidence Upload (SHA-256 Hashing)"]
        SCH["Incident Schedule Builder"]
    end

    subgraph Defense["Security Perimeter (Express.js)"]
        IPS["IP & User-Agent Stripper\n(req.ip = 0.0.0.0)"]
        RL["Strict Rate Limiter\n(express-rate-limit)"]
        HLM["Helmet & Strict CORS Policy"]
    end

    subgraph Intelligence["AI & Forensic Engine"]
        GPT["OpenAI GPT-4o Triage\n(Urgency 0-100, Summary, Tags)"]
        NLP["Forensic NLP Fraud Detector\n(Credibility & Spam Analysis)"]
        CV["CV Evidence Authenticity Engine\n(Tamper Score & SHA-256)"]
    end

    subgraph Storage["Encrypted Persistence"]
        CRYPTO["AES-256-GCM Encryption Engine\n(Unique IV + Salt + Auth Tag)"]
        PRISMA["Prisma ORM (Prepared Statements)"]
        DB[("Database\n(SQLite / PostgreSQL)")]
    end

    subgraph Portal["Investigator Portal"]
        DASH["Investigator Dashboard"]
        STATUS["Status & Case Workflow"]
        CHAT["Encrypted Anonymous Messenger"]
        AUDIT["Evidence Review Workflow"]
    end

    UI --> WIZ --> EVD --> SCH
    SCH -->|TLS 1.3 Payload| IPS
    IPS --> RL --> HLM
    HLM --> GPT & NLP & CV
    GPT & NLP & CV --> CRYPTO
    CRYPTO --> PRISMA --> DB
    DB --> PRISMA --> DASH & STATUS & CHAT & AUDIT
```

---

## 💻 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, TypeScript, TailwindCSS, Framer Motion, Lucide Icons, `i18next` |
| **Backend** | Node.js, Express 5, TypeScript, `ts-node-dev` |
| **Database & ORM** | Prisma ORM, SQLite *(default local)*, PostgreSQL *(production ready)* |
| **Security & Crypto** | AES-256-GCM (`crypto`), `helmet`, `express-rate-limit`, `bcrypt`, `jsonwebtoken` |
| **AI & Forensics** | OpenAI GPT-4o API, Forensic NLP Linguistic Scorer, CV Evidence Verification |
| **DevOps & Deploy** | Docker Compose, Render (`render.yaml`), Vercel config |

---

## 📁 Project Structure

```text
ShieldReport/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma         # Prisma Schema (Report, Evidence, Admin, Org)
│   │   └── dev.db                # SQLite database (local dev)
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── admin.controller.ts   # Case reviews, evidence review, status updates
│   │   │   ├── auth.controller.ts    # Admin JWT authentication
│   │   │   └── report.controller.ts  # Ingestion, case tracking, anonymous messaging
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts    # JWT guard for investigator endpoints
│   │   │   └── ipStripper.ts         # Pre-route IP, User-Agent & forwarded header purge
│   │   ├── routes/
│   │   │   ├── admin.routes.ts       # Protected admin API routes
│   │   │   ├── auth.routes.ts        # Admin login route
│   │   │   └── report.routes.ts      # Public reporter API routes
│   │   ├── utils/
│   │   │   ├── aiAnalyzer.ts         # OpenAI GPT-4o triage & forensic NLP scoring
│   │   │   ├── encryption.ts         # AES-256-GCM encrypt / decrypt engine
│   │   │   └── token.ts              # Cryptographic Case Token generator
│   │   ├── scripts/
│   │   │   └── seed.ts               # Database hydration with sample demo cases
│   │   ├── app.ts                    # Express application configuration
│   │   └── server.ts                 # Server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.tsx            # Apple Cupertino navigation & footer
│   │   ├── pages/
│   │   │   ├── Home.tsx              # Landing page with trust metrics & feature cards
│   │   │   ├── HowItWorks.tsx        # Step-by-step workflow guide
│   │   │   ├── Privacy.tsx           # Technical privacy & anonymity breakdown
│   │   │   ├── ReportForm.tsx        # Multi-step anonymous reporting wizard
│   │   │   ├── Track.tsx             # Case status tracking & encrypted messenger
│   │   │   └── admin/
│   │   │       ├── AdminLayout.tsx   # Investigator portal layout
│   │   │       ├── Dashboard.tsx     # High-priority triage, CV reviews & analytics
│   │   │       └── Login.tsx         # Investigator authentication page
│   │   ├── App.tsx                   # Route definitions
│   │   ├── main.tsx                  # App entry point
│   │   └── index.css                 # Cupertino glass styling & Tailwind directives
│   ├── tailwind.config.js            # Design tokens & color system
│   ├── vite.config.ts                # Vite build configuration
│   └── package.json
├── docs/
│   ├── anonymity.md                  # Proofs of network & telemetry mitigation
│   └── security.md                   # Threat model & AES-256-GCM architecture
├── docker-compose.yml                # Optional PostgreSQL service configuration
├── render.yaml                       # Automated Render blueprint for full-stack deploy
└── package.json                      # Root workspace scripts (concurrent runner)
```

---

## ⚡ Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v18.0.0 or later; v20+ / v24+ supported)
* [npm](https://www.npmjs.com/) (v9.0.0 or later)

---

### Environment Setup

Create `.env` in the project root:

```ini
# Server Port
PORT=5000

# Database URL (SQLite for local dev, PostgreSQL for production)
DATABASE_URL="file:./dev.db"

# Allowed Frontend Client
FRONTEND_URL="http://localhost:5173"

# High-Entropy 32-byte key (64 hex characters) for AES-256-GCM
ENCRYPTION_KEY="f1c13d7a9b0c2e4f0a1c3d7a9b0c2e4f0a1c3d7a9b0c2e4f0a1c3d7a9b0c2e4f"

# JWT Secret for Investigator Authentication
JWT_SECRET="supersafesecretkey_change_me_in_prod"

# Optional: OpenAI API Key for live GPT-4o analysis (skips analysis gracefully if empty)
OPENAI_API_KEY=""

# Optional: Redis URL for queueing and caching
REDIS_URL="redis://localhost:6379"
```

Configure frontend variables in `frontend/.env`:

```ini
VITE_BACKEND_URL="http://localhost:5000/api/v1"
```

---

### Database Initialization & Seeding

```bash
cd backend

# Install backend dependencies
npm install

# Generate Prisma client
npx prisma generate

# Hydrate the database with demo organization, investigator account, and sample reports
npx ts-node src/scripts/seed.ts
```

---

### Running the Application

You can launch both the frontend and backend servers simultaneously from the root directory:

```bash
# From the project root
npm run dev
```

Or run each service individually:

**Backend (API Server)**:
```bash
cd backend
npm run dev
# Server runs at http://localhost:5000
```

**Frontend (Client Web App)**:
```bash
cd frontend
npm install
npm run dev
# Web app runs at http://localhost:5173
```

---

## 🔑 Demo Credentials

A pre-configured investigator account is seeded into the database:

* **Portal URL**: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
* **Investigator Email**: `investigator@acme.com`
* **Password**: `admin123`
* **Organization**: `Acme Corporation` (`acme-corp`)

---

## 📡 API Reference

### Public Whistleblower Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/reports/submit` | Submit an encrypted anonymous report with optional evidence |
| `GET` | `/api/v1/reports/status/:token` | Retrieve sanitized case status and messages via Case Token |
| `POST` | `/api/v1/reports/message` | Send an encrypted anonymous follow-up message using Case Token |
| `GET` | `/health` | Health check endpoint returning API status |

### Investigator Endpoints *(JWT Required)*

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/auth/login` | Authenticate investigator and issue 8-hour JWT |
| `GET` | `/api/v1/admin/reports` | List all organization reports (decrypted for investigator) |
| `GET` | `/api/v1/admin/reports/:id` | Fetch complete report details, evidence, and message thread |
| `PATCH` | `/api/v1/admin/reports/:id/status` | Update case status (`UNDER_REVIEW`, `INVESTIGATION_STARTED`, etc.) |
| `PATCH` | `/api/v1/admin/evidence/:id/review` | Update CV evidence approval status and reviewer notes |
| `POST` | `/api/v1/admin/reports/:id/message` | Post investigator response to anonymous reporter thread |

---

## 🔒 Security & Anonymity Proofs

For complete mathematical proofs and defensive architecture specifications, consult the project documentation:

* 📄 [**Anonymity Model Documentation**](docs/anonymity.md): Detailed proof of IP neutralization, zero-fingerprint architecture, and Case Token mechanics.
* 📄 [**Security Architecture Documentation**](docs/security.md): Cryptographic guarantees of AES-256-GCM, IV entropy, rate-limiting rules, and SQLi mitigation via Prisma prepared statements.

---

## 🚢 Deployment

### Render (Automated Blueprint)
This repository includes a [`render.yaml`](render.yaml) blueprint:
1. Fork or push this repository to GitHub.
2. In Render, select **New > Blueprint**.
3. Connect your repository. Render will automatically provision:
   - PostgreSQL Database (`shieldreport-db`)
   - Node.js Web Service (`shieldreport-backend`)
   - Vite Static Site (`shieldreport-frontend`)

### Docker Compose
To run a local PostgreSQL instance via Docker:
```bash
docker-compose up -d
```
Update `DATABASE_URL` in `.env` to point to `postgresql://postgres:postgres@localhost:5432/shieldreport?schema=public`.

---

## 📄 License

This project is open-source and distributed under the [MIT License](LICENSE).
Built with integrity for secure whistleblowing and enterprise safety.
