"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"
import { updateAbsenceStatus } from "@/app/(dashboard)/dashboard/absences/actions"
import { toast } from "sonner"
import { AbsenceStatus } from "@prisma/client"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function AdminAbsenceList({ absences }: { absences: any[] }) {
    const [processing, setProcessing] = useState<string | null>(null)
    const router = useRouter()

    const handleAction = async (id: string, status: AbsenceStatus) => {
        setProcessing(id)
        try {
            await updateAbsenceStatus(id, status)
            toast.success(status === AbsenceStatus.APPROVED ? "Solicitud aprobada" : "Solicitud rechazada")
            router.refresh()
        } catch (error) {
            toast.error("Error al procesar solicitud")
        } finally {
            setProcessing(null)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Solicitudes Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Empleado</TableHead>
                            <TableHead>Desde</TableHead>
                            <TableHead>Hasta</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Motivo</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {absences.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground">
                                    No hay solicitudes pendientes.
                                </TableCell>
                            </TableRow>
                        )}
                        {absences.map((absence) => (
                            <TableRow key={absence.id}>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{absence.user.fullName || absence.user.email}</span>
                                        <span className="text-xs text-muted-foreground">{absence.user.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {format(new Date(absence.startDate), "dd/MM/yyyy", { locale: es })}
                                </TableCell>
                                <TableCell>
                                    {format(new Date(absence.endDate), "dd/MM/yyyy", { locale: es })}
                                </TableCell>
                                <TableCell className="capitalize">
                                    {absence.type === 'LICENSE' ? 'Vacaciones' : (absence.type === 'SICK' ? 'Enfermedad' : 'Otro')}
                                </TableCell>
                                <TableCell className="text-xs max-w-[200px] truncate">
                                    {absence.description || '-'}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                            onClick={() => handleAction(absence.id, AbsenceStatus.APPROVED)}
                                            disabled={processing === absence.id}
                                        >
                                            <Check className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleAction(absence.id, AbsenceStatus.REJECTED)}
                                            disabled={processing === absence.id}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
