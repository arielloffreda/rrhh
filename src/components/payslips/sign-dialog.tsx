"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { DocumentStatus } from "@prisma/client"
import { FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { signPayslip } from "@/app/(dashboard)/dashboard/payslips/actions"

interface SignDialogProps {
    payslip: any
}

export function SignDialog({ payslip }: SignDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const isSigned = payslip.status === "SIGNED"

    const handleSign = async () => {
        setLoading(true)
        try {
            await signPayslip(payslip.id)
            toast.success("Recibo firmado digitalmente")
            setOpen(false)
        } catch (error) {
            toast.error("Error al firmar")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={isSigned ? "secondary" : "default"} size="sm">
                    {isSigned ? <><CheckCircle className="mr-2 h-4 w-4" /> Ver Recibo</> : <><FileText className="mr-2 h-4 w-4" /> Ver y Firmar</>}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Recibo de Sueldo - {new Date(payslip.period).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</DialogTitle>
                    <DialogDescription>
                        {isSigned ? "Este documento ya ha sido firmado." : "Revise el documento antes de firmar."}
                    </DialogDescription>
                </DialogHeader>

                {/* PDF Placeholder */}
                {/* PDF Viewer */}
                {payslip.fileUrl ? (
                    <div className="h-[400px] w-full border rounded-md overflow-hidden bg-slate-100">
                        <iframe
                            src={payslip.fileUrl}
                            className="w-full h-full"
                            title="Recibo de Sueldo"
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-md bg-muted/50">
                        <p className="text-muted-foreground text-sm">Archivo no disponible</p>
                    </div>
                )}

                <DialogFooter className="sm:justify-between">
                    <div className="flex items-center text-xs text-muted-foreground">
                        {isSigned && (
                            <span className="flex items-center text-green-600">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Firmado el {new Date(payslip.signedAt).toLocaleDateString()}
                            </span>
                        )}
                        {!isSigned && (
                            <span className="flex items-center text-amber-600">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Pendiente de firma
                            </span>
                        )}
                    </div>
                    {!isSigned && (
                        <Button onClick={handleSign} disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Firmar Documento
                        </Button>
                    )}
                    {isSigned && (
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cerrar
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
