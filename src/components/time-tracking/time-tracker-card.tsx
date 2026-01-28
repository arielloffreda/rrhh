"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Play, Square } from "lucide-react"
import { clockIn, clockOut } from "@/actions/time-entry"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface TimeTrackerCardProps {
    initialStatus: 'ENTRY' | 'EXIT' | null // The TYPE of the last entry. ENTRY means they are currently working.
    lastEntryTime?: Date | null
}

export function TimeTrackerCard({ initialStatus, lastEntryTime }: TimeTrackerCardProps) {
    // If last entry was ENTRY, we are working.
    const [isWorking, setIsWorking] = useState(initialStatus === 'ENTRY')
    const [elapsedTime, setElapsedTime] = useState(0)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        let interval: NodeJS.Timeout

        if (isWorking && lastEntryTime) {
            const startTime = new Date(lastEntryTime).getTime()

            // Update immediately
            setElapsedTime(Math.floor((Date.now() - startTime) / 1000))

            interval = setInterval(() => {
                const now = Date.now()
                setElapsedTime(Math.floor((now - startTime) / 1000))
            }, 1000)
        } else {
            setElapsedTime(0)
        }

        return () => clearInterval(interval)
    }, [isWorking, lastEntryTime])

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600)
        const m = Math.floor((seconds % 3600) / 60)
        const s = seconds % 60
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }

    const handleToggle = async () => {
        setLoading(true)
        try {
            // Get location if possible
            let location = null
            if ("geolocation" in navigator) {
                try {
                    const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
                    })
                    location = { lat: pos.coords.latitude, lng: pos.coords.longitude }
                } catch (e) {
                    console.warn("Location access denied or failed", e)
                }
            }

            if (isWorking) {
                await clockOut({ location })
                toast.success("Has terminado tu jornada.")
                setIsWorking(false)
            } else {
                await clockIn({ location })
                toast.success("Has iniciado tu jornada.")
                setIsWorking(true)
                // In a real app we might want to refresh the page or update lastEntryTime from response
                // For now, optimistic update or simple page reload logic handled by parent or revalidatePath
            }
        } catch (error) {
            toast.error("Error al registrar actividad")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="glass border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Fichada
                </CardTitle>
                <Clock className={cn("h-4 w-4", isWorking ? "text-green-500 animate-pulse" : "text-muted-foreground")} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold font-mono my-2">
                    {isWorking ? formatTime(elapsedTime) : "--:--:--"}
                </div>

                <div className="flex flex-col gap-2">
                    <p className="text-xs text-muted-foreground mb-2">
                        {isWorking ? "Jornada en curso" : "Jornada no iniciada"}
                    </p>

                    <Button
                        onClick={handleToggle}
                        disabled={loading}
                        variant={isWorking ? "destructive" : "default"}
                        className="w-full"
                    >
                        {loading ? "Procesando..." : (
                            isWorking ? (
                                <>
                                    <Square className="mr-2 h-4 w-4 fill-current" /> Salir
                                </>
                            ) : (
                                <>
                                    <Play className="mr-2 h-4 w-4 fill-current" /> Ingresar
                                </>
                            )
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
