import { getPendingAbsences } from "@/app/(dashboard)/dashboard/absences/actions"
import { AdminAbsenceList } from "@/components/absences/admin-list"

export default async function AdminAbsencesPage() {
    const absences = await getPendingAbsences()

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Gestión de Licencias</h3>
                <p className="text-sm text-muted-foreground">
                    Aprueba o rechaza solicitudes de los empleados.
                </p>
            </div>
            <AdminAbsenceList absences={absences} />
        </div>
    )
}
