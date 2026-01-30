"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { getDetailedAttendanceReport, getEmployeeDetails } from "../actions"
import { Loader2, MapPin, CheckCircle, AlertTriangle } from "lucide-react" // Verification icons
import { Badge } from "@/components/ui/badge"

export default function AttendanceReportPage() {
    const [loading, setLoading] = useState(true)
    const [entries, setEntries] = useState<any[]>([])
    const [employees, setEmployees] = useState<any[]>([])

    // Filters
    const [selectedEmployee, setSelectedEmployee] = useState("ALL")
    // By default showing last 30 days or all could be confusing, let's show ALL initially or load on demand
    // For simplicity, I'll fetch recent

    useEffect(() => {
        // Load initial data
        Promise.all([
            getEmployeeDetails(),
            getDetailedAttendanceReport() // Default fetch (maybe limited or full)
        ]).then(([emps, data]) => {
            setEmployees(emps)
            setEntries(data)
        }).finally(() => setLoading(false))
    }, [])

    const handleFilterChange = async (value: string) => {
        setSelectedEmployee(value)
        setLoading(true)
        try {
            const data = await getDetailedAttendanceReport({
                employeeId: value
                // Add date range here if extended
            })
            setEntries(data)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Reporte de Fichadas</h2>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-base font-medium">Filtros</CardTitle>
                    <div className="flex items-center gap-2">
                        <Select value={selectedEmployee} onValueChange={handleFilterChange}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Empleado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Todos los Empleados</SelectItem>
                                {employees.map(e => (
                                    <SelectItem key={e.id} value={e.id}>{e.fullName || e.email}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {/* Date Range Picker Placeholder */}
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex h-32 items-center justify-center">
                            <Loader2 className="animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Empleado</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Evento</TableHead>
                                    <TableHead>Modalidad</TableHead>
                                    <TableHead>Ubicación</TableHead>
                                    <TableHead>Estado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {entries.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                            No se encontraron registros.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    entries.map((entry) => (
                                        <TableRow key={entry.id}>
                                            <TableCell className="font-medium">{entry.user}</TableCell>
                                            <TableCell>
                                                {format(new Date(entry.timestamp), "dd/MM/yyyy HH:mm", { locale: es })}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={entry.type === 'ENTRY' ? "default" : "secondary"}>
                                                    {entry.type === 'ENTRY' ? 'Entrada' : 'Salida'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm capitalize text-muted-foreground">
                                                    {entry.mode === 'REMOTE' ? 'Home Office' : 'Oficina'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-xs">
                                                {entry.location ? (
                                                    <a
                                                        href={`https://maps.google.com/?q=${(entry.location as any).lat},${(entry.location as any).lng}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="hover:underline flex items-center gap-1 text-blue-600 dark:text-blue-400"
                                                    >
                                                        <MapPin className="h-3 w-3" /> Ver mapa
                                                    </a>
                                                ) : '-'}
                                            </TableCell>
                                            <TableCell>
                                                {entry.isVerified ? (
                                                    <div className="flex items-center text-green-600 gap-1 text-xs font-medium" title="Ubicación Verificada">
                                                        <CheckCircle className="h-4 w-4" /> OK
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center text-amber-600 gap-1 text-xs font-medium" title={(entry.metadata as any)?.note || "No verificado"}>
                                                        <AlertTriangle className="h-4 w-4" />
                                                        {(entry.metadata as any)?.note ? "Warning" : "Dudoso"}
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
