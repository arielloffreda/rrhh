"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RequestAbsenceDialog } from "./request-dialog"

export function AbsenceList({ absences }: { absences: any[] }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Historial de Licencias</CardTitle>
                <RequestAbsenceDialog />
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Desde</TableHead>
                            <TableHead>Hasta</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Comentario</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {absences.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground">
                                    No tienes solicitudes registradas.
                                </TableCell>
                            </TableRow>
                        )}
                        {absences.map((absence) => (
                            <TableRow key={absence.id}>
                                <TableCell>
                                    {new Date(absence.startDate).toLocaleDateString("es-AR")}
                                </TableCell>
                                <TableCell>
                                    {new Date(absence.endDate).toLocaleDateString("es-AR")}
                                </TableCell>
                                <TableCell className="capitalize">
                                    {absence.type === 'LICENSE' ? 'Vacaciones' : (absence.type === 'SICK' ? 'Enfermedad' : 'Otro')}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={absence.status === "APPROVED" ? "default" : (absence.status === "REJECTED" ? "destructive" : "secondary")}>
                                        {absence.status === "APPROVED" ? "Aprobado" : (absence.status === "REJECTED" ? "Rechazado" : "Pendiente")}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                                    {absence.description || '-'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
