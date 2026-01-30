"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export function DailyLog({ entries }: { entries: any[] }) {
    // Calculate total hours
    let totalMs = 0
    let entryTime: number | null = null

    // We assume entries are sorted by timestamp asc
    entries.forEach(e => {
        if (e.type === 'ENTRY') {
            entryTime = new Date(e.timestamp).getTime()
        } else if (e.type === 'EXIT' && entryTime !== null) {
            totalMs += new Date(e.timestamp).getTime() - entryTime
            entryTime = null
        }
    })

    // If still working (last was ENTRY), add current duration (optional, or just show closed intervals)
    // For a history log, usually we show completed intervals or just list events. 
    // Let's stick to listing events but maybe show "Partial Total" of closed sessions.

    // To format duration
    const formatDuration = (ms: number) => {
        const h = Math.floor(ms / (1000 * 60 * 60))
        const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
        return `${h}h ${m}m`
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Historial de Hoy</CardTitle>
                <Badge variant="outline" className="text-sm font-mono">
                    Total: {formatDuration(totalMs)}
                </Badge>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Hora</TableHead>
                            <TableHead>Evento</TableHead>
                            <TableHead>Modalidad</TableHead>
                            <TableHead className="text-right">Ubicación</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {entries.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                    No hay actividad registrada hoy.
                                </TableCell>
                            </TableRow>
                        )}
                        {entries.map((entry) => (
                            <TableRow key={entry.id}>
                                <TableCell className="font-mono font-medium">
                                    {format(new Date(entry.timestamp), "HH:mm", { locale: es })}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={entry.type === 'ENTRY' ? "default" : "secondary"}>
                                        {entry.type === 'ENTRY' ? 'Entrada' : 'Salida'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-muted-foreground capitalize">
                                        {entry.mode === 'REMOTE' ? 'Home Office' : 'Oficina'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right text-xs text-muted-foreground max-w-[150px] truncate">
                                    {entry.location ? (
                                        <a
                                            href={`https://maps.google.com/?q=${(entry.location as any).lat},${(entry.location as any).lng}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:underline flex items-center justify-end gap-1"
                                        >
                                            Ver mapa
                                        </a>
                                    ) : '-'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
