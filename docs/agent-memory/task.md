# HR SaaS Platform - Development Tasks

## Phase 1: Foundation & Infrastructure
- [x] Initial Next.js Setup
- [x] Database Schema Design (Prisma) [schema.prisma]
- [x] UI Component Library Setup (Tailwind + Shadcn/UI)
- [x] Authentication System (NextAuth v5 / Auth.js)
    - [x] Login Page
    - [x] Session Management
    - [x] Role-based Route Protection
- [x] Multi-tenancy Logic (Tenant context/middleware)
- [x] Localization (Spanish AR)

## Phase 2: Core Features
### User Management
- [x] User Dashboard (Layout & Shell)
- [x] Employee Profile View
- [ ] Admin: Employee CRUD & Assignments

### Time Tracking
- [x] Clock In/Out Interface
    - [ ] Geolocation Capture
    - [ ] IP / Device Validation
- [ ] Time Entry Logs View
- [ ] Admin: Manual Entry / Correction

### Absence Management (Licencias)
- [x] Request Absence Modal/Page
- [ ] Usage/Balance View
- [ ] Admin: Approval Workflow

### Payslips (Recibos)
- [x] Digital Signing Interface
- [ ] PDF Viewer Integration
- [ ] Admin: Upload & Assignment

## Phase 3: Advanced Features
- [ ] Performance Reviews Module
- [ ] Reporting & Analytics Dashboard
- [ ] Mobile PWA Configuration
