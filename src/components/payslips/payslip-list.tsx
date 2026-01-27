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
import { SignDialog } from "./sign-dialog"

export function PayslipList({ payslips }: { payslips: any[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Mis Recibos</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Periodo</TableHead>
                            <TableHead>Fecha Emisión</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payslips.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground">
                                    No tienes recibos disponibles.
                                </TableCell>
                            </TableRow>
                        )}
                        {payslips.map((payslip) => (
                            <TableRow key={payslip.id}>
                                <TableCell className="font-medium capitalize">
                                    {new Date(payslip.period).toLocaleDateString("es-AR", { month: 'long', year: 'numeric' })}
                                </TableCell>
                                <TableCell>
                                    {new Date(payslip.createdAt).toLocaleDateString("es-AR")}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={payslip.status === "SIGNED" ? "default" : "destructive"}>
                                        {payslip.status === "SIGNED" ? "Firmado" : "Pendiente"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <SignDialog payslip={payslip} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
