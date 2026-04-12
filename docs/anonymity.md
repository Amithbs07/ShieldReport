# Anonymity Model: ShieldReport

ShieldReport is built fundamentally on the principle that anonymity must be enforced by architecture, not just by policy. This document provides the mathematical and programmatic proof of how anonymity is preserved.

## The Anonymous Threat Model
When a whistleblower submits a report, the threats to their anonymity are:
1.  **Network-level identification**: IP logging, ISP routing.
2.  **Device-level identification**: Browser fingerprinting, cookies, hardware telemetry.
3.  **Application-level identification**: Accidental collection of PII, account creation mapping.

## Mitigations

### 1. Network Level Stripping
We run a dedicated Express Middleware (`src/middleware/ipStripper.ts`) that runs explicitly **before** the Express router reaches the controller.
```TypeScript
req.ip = '0.0.0.0';
delete req.headers['x-forwarded-for'];
delete req.headers['x-real-ip'];
delete req.headers['user-agent'];
```
By the time the code reaches business logic (`submitReport`), the system literally has 0 awareness of where the request originated from. The database schema does not even have an `ip_address` column.

### 2. Zero-Fingerprint Architecture
The frontend web application (React/Vite) forces zero telemetry.
*   No Google Analytics.
*   No local storage tokens for reporters.
*   No third-party fonts (fonts are bundled locally) to prevent third-party logging.

### 3. The CASE TOKEN Authentication
Instead of "sign up to track your report", we use zero-knowledge stateless claims.
When a report completes, the user receives a 12-char token (`SHR-4B9X-21PL`).
This token does not map to their email. It maps to the *Case ID*. The user essentially proves they have the password to the locker, not that they are the person who bought the locker. 
Without this token, not even the administrators can correlate two separate reports back to the same device.

### Open Source Guarantee
Our anonymity logic is entirely transparent. You can trace the payload from `<ReportForm />` in the frontend straight to `report.controller.ts` in the backend to verify that identifiable data is violently destroyed before database insertion.
