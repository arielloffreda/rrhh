import { getAllUsers } from "@/app/(dashboard)/dashboard/payslips/actions"
import { UploadPayslipForm } from "@/components/payslips/upload-form"

export default async function AdminPayslipsPage() {
    const users = await getAllUsers()

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Gestión de Recibos</h3>
                <p className="text-sm text-muted-foreground">
                    Sube los recibos de sueldo para tus empleados.
                </p>
            </div>
            <div className="max-w-md">
                <UploadPayslipForm users={users} />
            </div>
        </div>
    )
}
