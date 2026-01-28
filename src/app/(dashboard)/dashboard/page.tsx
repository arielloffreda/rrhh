import { auth } from "@/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, AlertCircle } from "lucide-react"
import { getLastEntry, getTodayEntries } from "@/actions/time-entry"
import { TimeTrackerCard } from "@/components/time-tracking/time-tracker-card"
import { DailyLog } from "@/components/time-tracking/daily-log"

export default async function DashboardPage() {
    const session = await auth()
    const user = session?.user

    // Fetch real data
    const lastEntry = await getLastEntry(user?.id)
    const todayEntries = await getTodayEntries(user?.id)

    return (
        <div className="grid auto-rows-min gap-4 md:grid-cols-3 relative">
            <div className="col-span-full mb-4">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Hola de nuevo, {user?.name?.split(' ')[0]} 👋
                </h1>
                <p className="text-muted-foreground text-lg">Aquí tienes un resumen de tu actividad hoy.</p>
            </div>

            {/* TimeTrackerCard - Clean Style */}
            <div className="rounded-xl overflow-hidden relative">
                <TimeTrackerCard
                    initialStatus={lastEntry?.type || null}
                    lastEntryTime={lastEntry?.type === 'ENTRY' ? lastEntry.timestamp : null}
                />
            </div>

            <Card className="hover:shadow-md transition-shadow duration-300">
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

            <Card className="hover:shadow-md transition-shadow duration-300">
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

            <div className="col-span-full">
                <DailyLog entries={todayEntries} />
            </div>
        </div>
    )
}
