import { getMyAbsences } from "@/app/(dashboard)/dashboard/absences/actions"
import { AbsenceList } from "@/components/absences/absence-list"

export default async function AbsencesPage() {
    const absences = await getMyAbsences()

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Licencias</h3>
                <p className="text-sm text-muted-foreground">
                    Gestiona tus solicitudes de vacaciones y días por enfermedad.
                </p>
            </div>
            <AbsenceList absences={absences} />
        </div>
    )
}
