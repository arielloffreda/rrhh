import { auth } from "@/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, CalendarDays, FileText, AlertCircle } from "lucide-react"

export default async function DashboardPage() {
    const session = await auth()
    const user = session?.user

    return (
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="col-span-full mb-4">
                <h1 className="text-2xl font-bold tracking-tight">Hola de nuevo, {user?.name?.split(' ')[0]} 👋</h1>
                <p className="text-muted-foreground">Aquí tienes un resumen de tu actividad hoy.</p>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Fichada
                    </CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">--:--</div>
                    <p className="text-xs text-muted-foreground">
                        No has ingresado aún
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Licencias Disponibles
                    </CardTitle>
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">12 Días</div>
                    <p className="text-xs text-muted-foreground">
                        Vacaciones restantes
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Acciones Pendientes
                    </CardTitle>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">
                        Tareas que requieren atención
                    </p>
                </CardContent>
            </Card>

            <div className="col-span-full min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
    )
}
