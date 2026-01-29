"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import { Plus } from "lucide-react"
import { EmployeeForm } from "./employee-form"

export function AddEmployeeDialog() {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button><Plus className="mr-2 h-4 w-4" /> Agregar Empleado</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Nuevo Empleado</DialogTitle>
                    <DialogDescription>
                        Crea un nuevo usuario para tu organización. Contraseña por defecto: 123456
                    </DialogDescription>
                </DialogHeader>
                <EmployeeForm onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    )
}
