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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Plus, Upload, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
import { toast } from "sonner"
import { requestAbsence } from "@/app/(dashboard)/dashboard/absences/actions"
// import { AbsenceType } from "@prisma/client"

// Redefining enum locally to avoid client-component import issues with Prisma enums
enum AbsenceType {
    SICK = "SICK",
    LICENSE = "LICENSE",
    UNJUSTIFIED = "UNJUSTIFIED",
    OTHER = "OTHER"
}

const formSchema = z.object({
    type: z.nativeEnum(AbsenceType),
    startDate: z.date(),
    endDate: z.date(),
    description: z.string().optional(),
    attachments: z.array(z.string()).optional(),
})

export function RequestAbsenceDialog() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [attachments, setAttachments] = useState<string[]>([])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            attachments: [],
        }
    })

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        setUploading(true)
        const formData = new FormData()
        formData.append("file", files[0])

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            if (!res.ok) throw new Error("Upload failed")

            const data = await res.json()
            const newAttachments = [...attachments, data.url]
            setAttachments(newAttachments)
            form.setValue("attachments", newAttachments)
            toast.success("Archivo subido correctamente")
        } catch (error) {
            toast.error("Error al subir archivo")
            console.error(error)
        } finally {
            setUploading(false)
            // Clear input
            e.target.value = ""
        }
    }

    const removeAttachment = (indexToRemove: number) => {
        const newAttachments = attachments.filter((_, index) => index !== indexToRemove)
        setAttachments(newAttachments)
        form.setValue("attachments", newAttachments)
    }

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setLoading(true)
        try {
            await requestAbsence(data)
            toast.success("Solicitud enviada correctamente")
            setOpen(false)
            form.reset()
            setAttachments([])
        } catch (error) {
            toast.error("Error al enviar solicitud")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button><Plus className="mr-2 h-4 w-4" /> Solicitar Licencia</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Nueva Solicitud</DialogTitle>
                    <DialogDescription>
                        Complete los detalles de su licencia y adjunte comprobantes si es necesario.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione un motivo" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="LICENSE">Vacaciones</SelectItem>
                                            <SelectItem value="SICK">Enfermedad</SelectItem>
                                            <SelectItem value="OTHER">Otro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Desde</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Seleccionar fecha</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Hasta</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Seleccionar fecha</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Motivo (Opcional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Comentarios adicionales" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* File Upload Section */}
                        <div className="space-y-2">
                            <FormLabel>Comprobantes</FormLabel>
                            <FormControl>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="file"
                                        onChange={handleFileUpload}
                                        disabled={uploading}
                                        className="cursor-pointer"
                                        accept="image/*,.pdf"
                                    />
                                    {uploading && <span className="text-sm text-muted-foreground">Subiendo...</span>}
                                </div>
                            </FormControl>
                            <FormDescription>
                                Sube certificados médicos o comprobantes (PDF, JPG, PNG).
                            </FormDescription>

                            {attachments.length > 0 && (
                                <div className="mt-2 space-y-2">
                                    {attachments.map((url, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 border rounded-md text-sm">
                                            <span className="truncate max-w-[300px]">{url.split('/').pop()}</span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeAttachment(index)}
                                                type="button"
                                            >
                                                <X className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <DialogFooter>
                            <Button type="submit" disabled={loading || uploading}>
                                {loading ? "Enviando..." : "Enviar Solicitud"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
