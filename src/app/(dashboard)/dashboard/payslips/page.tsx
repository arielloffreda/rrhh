import { getMyPayslips } from "@/app/(dashboard)/dashboard/payslips/actions"
import { PayslipList } from "@/components/payslips/payslip-list"

export default async function PayslipsPage() {
    const payslips = await getMyPayslips()

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Recibos de Sueldo</h3>
                <p className="text-sm text-muted-foreground">
                    Visualiza y firma digitalmente tus recibos de sueldo.
                </p>
            </div>
            <PayslipList payslips={payslips} />
        </div>
    )
}
