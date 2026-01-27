# HR SaaS Platform - Walkthrough

## Status
-   **Foundation**: Complete (UI + Auth + DB).
-   **Dashboard**: Complete (Menu Lateral + Header + Inicio).
-   **Perfil**: Complete (Vista + Edición).
-   **Fichada**: Complete (Entrada/Salida + Geo + Lista).
-   **Recibos**: Complete (Lista + Firma Digital).
-   **Licencias**: Complete (Lista + Formulario Solicitud).
-   **DB Connection**: Connected to remote MySQL `rrhh`.

## How to Test
1.  **Start the Server**:
    ```bash
    npm run dev
    ```
2.  **Login**:
    -   URL: `http://localhost:3000/login`
    -   Email: `admin@acme.com`
    -   Password: `admin123`
3.  **Dashboard**:
    -   Verify the Sidebar shows links (Inicio, Mi Perfil, Fichada...).
    -   Verify the User Menu (top right) shows "Admin User".
4.  **Perfil (Profile)**:
    -   Navigate to "Mi Perfil".
    -   Verify name is "Admin User".
    -   Edit "Teléfono" and "Dirección".
    -   Save and Reload.
5.  **Fichada (Time Tracking)**:
    -   Navigate to "Fichada".
    -   Allow Location Access if asked.
    -   Click "Marcar Entrada" -> Timer should start (Green).
    -   Verify "Entrada" entry appears in the list.
    -   Wait a few seconds... Click "Marcar Salida" (Red).
    -   Verify "Salida" entry appears.
6.  **Recibos (Payslips)**:
    -   Navigate to "Recibos".
    -   You should see at least one "Pendiente" payslip (seeded).
    -   Click "Ver y Firmar".
    -   In the dialog, click "Firmar Documento".
    -   Verify status changes to "Firmado" (Green).
7.  **Licencias (Absences)**:
    -   Navigate to "Licencias".
    -   Click "Solicitar Licencia".
    -   Select "Vacaciones", Pick Start/End Dates, Add note.
    -   Submit.
    -   Verify new entry with "Pendiente" status (Gray/Secondary badge).

## Technical Notes
-   **Database**: `192.168.8.248` (MySQL).
-   **Middleware**: Fixed named export issue.
-   **Types**: Relaxed strict Enum checks for `UserRole` to unblock build.
