# Security Architecture: ShieldReport

This document outlines the security architecture and defensive mechanisms implemented in ShieldReport.

## Encryption Standards

### 1. Data at Rest (AES-256-GCM)
All sensitive reporter data (such as the `description` string) is encrypted using AES-256-GCM. 
*   **Key**: A 32-byte (256-bit) high-entropy secret (`ENCRYPTION_KEY` env variable).
*   **Initialization Vector (IV)**: A cryptographically secure 16-byte random sequence generated uniquely for every single database operation.
*   **Salt**: A 64-byte random salt.
*   **Auth Tag**: GCM inherently provides authentication tags to ensure ciphertext integrity and prevent tampering.

If the PostgreSQL database is ever compromised, leaked, or accessed by an unauthorized administrator, the sensitive description fields remain unreadable.

### 2. Transport Layer Security
*   All connections between the Frontend PWA and backend API enforce TLS 1.3.

## Network & API Defense

### 1. Rate Limiting
*   Implemented via `express-rate-limit`.
*   Submission endpoint is restricted to **5 requests per IP address per hour** to heavily throttle spam and brute-force token enumeration.

### 2. Headers & Protection
*   **Helmet.js** is actively filtering and securing HTTP headers, dropping `X-Powered-By`, enforcing `Strict-Transport-Security`, and preventing MIME-sniffing.
*   Cross-Origin Resource Sharing (CORS) is explicitly whitelisted to the Frontend domain name, stripping unauthorized external requests.

### 3. Dependency Injection Prevention
*   We utilize **Prisma ORM** for all database queries. Prisma uses prepared statements natively beneath the hood mapping dynamic input safely, achieving zero-risk of standard SQL Injection vectors.

## Authentication (Admin)
*   Administrators authenticate using emails and rigorous `bcrypt` hashed passwords.
*   Session state is managed by 8-hour expiry JSON Web Tokens (JWTs) ensuring continuous re-authentication.

## Penetration Test Checklist
- [x] Ensure `pgdata` volume is not exposed to external ports.
- [x] Attempt SQLi on the `/api/v1/auth/login` endpoint (Mitigated by Prisma).
- [x] Verify that an unauthorized GET request to `/reports` without a valid JWT terminates with 401 Unauthorized.
- [x] Force a brute force token-guessing loop against `/api/v1/reports/status/:token` (Mitigated by rate-limiting).
