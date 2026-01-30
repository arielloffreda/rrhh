"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Square, MapPin, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { logTimeEntry } from "@/app/(dashboard)/dashboard/time-tracking/actions"
// import { TimeEntryType } from "@prisma/client"

interface TimeTrackerProps {
    lastEntryType: string | null
    lastEntryTime: Date | null
}

export function TimeTracker({ lastEntryType, lastEntryTime }: TimeTrackerProps) {
    const [isWorking, setIsWorking] = useState(lastEntryType === 'ENTRY')
    const [loading, setLoading] = useState(false)
    const [elapsed, setElapsed] = useState("00:00:00")
    const [workMode, setWorkMode] = useState<"REMOTE" | "PRESENTIAL">("REMOTE")

    useEffect(() => {
        let interval: NodeJS.Timeout

        if (isWorking && lastEntryTime) {
            interval = setInterval(() => {
                const now = new Date()
                const diff = now.getTime() - new Date(lastEntryTime).getTime()

                const hours = Math.floor(diff / (1000 * 60 * 60))
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
                const seconds = Math.floor((diff % (1000 * 60)) / 1000)

                setElapsed(
                    `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
                )
            }, 1000)
        } else {
            setElapsed("00:00:00")
        }

        return () => clearInterval(interval)
    }, [isWorking, lastEntryTime])

    const handleToggle = async () => {
        setLoading(true)
        try {
            // Request Geolocation
            let location = undefined
            if ("geolocation" in navigator) {
                try {
                    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
                    });
                    location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }
                } catch (error) {
                    console.warn("Geolocation failed or denied", error)
                    toast.warning("No se pudo capturar la ubicación exacta. Se registrará sin ubicación.")
                }
            }

            const type = isWorking ? 'EXIT' : 'ENTRY'
            // @ts-ignore - Prisma enum import might be tricky in client components, passing string is safe if type matches
            await logTimeEntry(type, workMode, location)

            setIsWorking(!isWorking)
            toast.success(isWorking ? "Salida registrada exitosamente" : "Entrada registrada exitosamente")

        } catch (error) {
            console.error(error)
            toast.error("Error al registrar el fichaje")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Control de Horario</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-6 py-6">
                <div className={`text-5xl font-mono font-bold ${isWorking ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                    {isWorking ? elapsed : "No Activo"}
                </div>

                {!isWorking && (
                    <div className="flex bg-muted p-1 rounded-lg">
                        <button
                            onClick={() => setWorkMode("REMOTE")}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${workMode === "REMOTE"
                                    ? "bg-background shadow text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            Home Office
                        </button>
                        <button
                            onClick={() => setWorkMode("PRESENTIAL")}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${workMode === "PRESENTIAL"
                                    ? "bg-background shadow text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            Oficina
                        </button>
                    </div>
                )}

                <Button
                    size="lg"
                    className={`w-48 h-16 text-lg gap-2 ${isWorking ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'}`}
                    onClick={handleToggle}
                    disabled={loading}
                >
                    {loading ? <Loader2 className="animate-spin" /> : (isWorking ? <Square /> : <Play />)}
                    {isWorking ? "Marcar Salida" : "Marcar Entrada"}
                </Button>

                <div className="flex items-center text-xs text-muted-foreground gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>Ubicación requerida para fichar</span>
                </div>
            </CardContent>
        </Card>
    )
}
