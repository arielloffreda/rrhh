"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { EmployeeForm } from "./employee-form"
import { deleteEmployee } from "@/app/(dashboard)/dashboard/employees/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function EmployeeActions({ employee }: { employee: any }) {
    const [openEdit, setOpenEdit] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleDelete() {
        setLoading(true)
        try {
            await deleteEmployee(employee.id)
            toast.success("Empleado eliminado")
            setOpenDelete(false)
            router.refresh()
        } catch (error: any) {
            toast.error(error.message || "Error al eliminar")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setOpenEdit(true)}>
                        <Pencil className="mr-2 h-4 w-4" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpenDelete(true)} className="text-destructive focus:text-destructive">
                        <Trash className="mr-2 h-4 w-4" /> Eliminar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Edit Dialog */}
            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Editar Empleado</DialogTitle>
                        <DialogDescription>
                            Modifica los datos del empleado.
                        </DialogDescription>
                    </DialogHeader>
                    <EmployeeForm
                        initialData={employee}
                        onSuccess={() => setOpenEdit(false)}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Alert */}
            <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente al empleado y sus datos asociados.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={loading}>
                            {loading ? "Eliminando..." : "Eliminar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
