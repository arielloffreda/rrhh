"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export function DailyLog({ entries }: { entries: any[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Actividad Diaria</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Hora</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Ubicación</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {entries.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center text-muted-foreground">Sin actividad hoy.</TableCell>
                            </TableRow>
                        )}
                        {entries.map((entry) => (
                            <TableRow key={entry.id}>
                                <TableCell className="font-mono">
                                    {format(new Date(entry.timestamp), "HH:mm", { locale: es })}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={entry.type === 'ENTRY' ? "default" : "secondary"}>
                                        {entry.type === 'ENTRY' ? 'Entrada' : 'Salida'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">
                                    {entry.location ? 'Ubicación registrada' : 'Desconocida'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
