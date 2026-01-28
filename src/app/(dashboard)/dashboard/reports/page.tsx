import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Users, Calendar, Clock } from "lucide-react"

async function getStats() {
    const session = await auth()
    // In real app, filter by tenantId from session
    const tenantId = session?.user?.tenantId

    const totalEmployees = await prisma.user.count({
        where: { tenantId }
    })

    const totalAbsences = await prisma.absenceReport.count({
        where: { tenantId }
    })

    const pendingAbsences = await prisma.absenceReport.count({
        where: { tenantId, status: 'PENDING' }
    })

    // Placeholder for hours worked - would need complex aggregation
    const totalEntries = await prisma.timeEntry.count({
        where: { tenantId }
    })

    return { totalEmployees, totalAbsences, pendingAbsences, totalEntries }
}

export default async function ReportsPage() {
    const stats = await getStats()

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Reportes y Estadísticas</h3>
                <p className="text-sm text-muted-foreground">
                    Resumen de actividad de la organización.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Empleados
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalEmployees}</div>
                        <p className="text-xs text-muted-foreground">
                            Usuarios activos
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Solicitudes Totales
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalAbsences}</div>
                        <p className="text-xs text-muted-foreground">
                            Licencias solicitadas
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Pendientes de Aprobación
                        </CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pendingAbsences}</div>
                        <p className="text-xs text-muted-foreground">
                            Requieren atención
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Registros de Fichada
                        </CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalEntries}</div>
                        <p className="text-xs text-muted-foreground">
                            Entradas y Salidas
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Placeholder for future Charts */}
            <Card>
                <CardHeader>
                    <CardTitle>Actividad Mensual</CardTitle>
                </CardHeader>
                <CardContent className="h-[200px] flex items-center justify-center text-muted-foreground">
                    Gráfico de asistencias próximamente...
                </CardContent>
            </Card>
        </div>
    )
}
