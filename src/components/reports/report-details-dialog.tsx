"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Download, Loader2 } from "lucide-react"
import { generatePDF } from "./pdf-generator" // We will create this next
import { toast } from "sonner"

interface ReportDetailsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    data: any[]
    columns: { header: string, accessorKey: string }[]
    loading: boolean
    reportType: string
}

export function ReportDetailsDialog({
    open,
    onOpenChange,
    title,
    data,
    columns,
    loading,
    reportType
}: ReportDetailsDialogProps) {

    const handleDownload = () => {
        try {
            generatePDF(title, columns, data)
            toast.success("PDF generado correctamente")
        } catch (error) {
            console.error(error)
            toast.error("Error al generar PDF")
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <div className="flex items-center justify-between mr-8">
                        <div>
                            <DialogTitle>{title}</DialogTitle>
                            <DialogDescription>
                                {data.length} registros encontrados
                            </DialogDescription>
                        </div>
                        <Button onClick={handleDownload} disabled={loading || data.length === 0} size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Descargar PDF
                        </Button>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-auto border rounded-md min-h-[300px]">
                    {loading ? (
                        <div className="h-full flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {columns.map((col) => (
                                        <TableHead key={col.accessorKey}>{col.header}</TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="text-center h-24 text-muted-foreground">
                                            No hay datos disponibles.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    data.map((row, i) => (
                                        <TableRow key={i}>
                                            {columns.map((col) => (
                                                <TableCell key={col.accessorKey}>
                                                    {String(row[col.accessorKey] || "")}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
