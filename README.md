# ShieldReport: Speak Without fear

ShieldReport is a production-grade, highly secure, and 100% anonymous whistleblower and reporting platform designed to solve the critical gaps in existing enterprise integrity systems. 

## Features
- **Absolute Anonymity**: Network IPs and user-agents are actively stripped before business logic executes. 
- **End-to-End Encryption**: Incident descriptions are securely locked with AES-256-GCM. If the database leaks, the data remains unreadable.
- **AI Triage**: Incoming reports are secretly parsed via OpenAI (GPT-4o) to generate a severity/urgency score (0-100), ensuring critical HR or safety violations are flagged immediately.
- **Token Tracking**: No accounts, no emails. Submitters receive a unique 12-character alphanumeric Token (`SHR-XXXX-XXXX`) which serves as their absolute key to check progress status safely.

## Tech Stack
*   **Web Application**: React (Vite) + TailwindCSS + Framer Motion
*   **Server**: Node.js + Express
*   **Database**: PostgreSQL managed natively by Prisma ORM
*   **Infrastructure**: Docker + Redis

## Local Development Setup

Ensure you have Docker and Node installed.

1. **Start the Database**
   ```bash
   docker-compose up -d
   ```
2. **Backend Setup**
   ```bash
   cd backend
   npm install
   npx prisma generate
   npx prisma migrate dev --name init
   npm run dev
   ```
3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

Make sure to copy `.env.example` to `.env` in the root and configure your OpenAI Key and Security Encryption Secrets!

## Security & Architecture Proofs
Please review `/docs/security.md` and `/docs/anonymity.md` to understand how we securely strip metadata and encrypt data.

---
*Built for the final major project submission.*
