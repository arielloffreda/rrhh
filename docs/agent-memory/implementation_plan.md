# Implementation Plan - Absences (Licencias)

## Goal Description
Implement the **Absence Management** module. Employees can view their leave history and request new absences (Vacation, Sick Leave, etc.).

## User Review Required
> [!NOTE]
> The initial implementation will default all new requests to `PENDING` status.
> We'll implement a basic form to capture Start Date, End Date, Type, and Reason.

## Proposed Changes

### Database
-   Use existing `AbsenceReport` model.
-   Enums: `AbsenceType` (SICK, LICENSE, etc.), `AbsenceStatus`.

### Components
#### [NEW] `src/components/absences/absence-list.tsx`
-   Table displaying: Type, Dates, Days Count, Status (Badge).
-   "Solicitar Licencia" button opens the request dialog.

#### [NEW] `src/components/absences/request-dialog.tsx`
-   Form with `react-hook-form` + `zod`.
-   Fields: Type (Select), Start Date (DatePicker), End Date (DatePicker), Reason (Textarea).

### Server Actions
#### [NEW] `src/app/(dashboard)/dashboard/absences/actions.ts`
-   `getMyAbsences()`: Fetch user's reports.
-   `requestAbsence(data)`: Create new `AbsenceReport`.

### Routes
#### [NEW] `src/app/(dashboard)/dashboard/absences/page.tsx`
-   Fetches absences.
-   Renders `AbsenceList`.

## Verification Plan
### Manual Verification
1.  **Navigate**: Go to `/dashboard/absences`.
2.  **Request**: Click "Solicitar Licencia".
3.  **Fill**: Select "Vacaciones", pick dates, add reason "Descanso".
4.  **Submit**: Verify toast success and list update.
5.  **Check Status**: Verify status is "Pendiente" (Yellow badge).
