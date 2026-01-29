"use client"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
import { toast } from "sonner"
import { uploadPayslip } from "@/app/(dashboard)/dashboard/payslips/actions"
import { Upload, X, FileText } from "lucide-react"

const formSchema = z.object({
    userId: z.string().min(1, "Seleccione un empleado"),
    month: z.string().min(1, "Seleccione un mes"),
    year: z.string().min(4, "Seleccione un año"),
})

export function UploadPayslipForm({ users }: { users: any[] }) {
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [fileUrl, setFileUrl] = useState<string | null>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            year: new Date().getFullYear().toString()
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
            setFileUrl(data.url)
            toast.success("Archivo subido correctamente")
        } catch (error) {
            toast.error("Error al subir archivo")
            console.error(error)
        } finally {
            setUploading(false)
            e.target.value = ""
        }
    }

    async function onSubmit(data: z.infer<typeof formSchema>) {
        if (!fileUrl) {
            toast.error("Debe subir un archivo PDF")
            return
        }

        setLoading(true)
        try {
            // Construct date from month/year (first day of month)
            const period = new Date(parseInt(data.year), parseInt(data.month) - 1, 1)

            await uploadPayslip({
                userId: data.userId,
                period: period,
                fileUrl: fileUrl
            })

            toast.success("Recibo cargado correctamente")
            form.reset()
            setFileUrl(null)
        } catch (error: any) {
            toast.error(error.message || "Error al cargar recibo")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Cargar Nuevo Recibo</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="userId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Empleado</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione un empleado" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {users.map((user) => (
                                                <SelectItem key={user.id} value={user.id}>
                                                    {user.fullName || user.email}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="month"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mes</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Mes" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Array.from({ length: 12 }, (_, i) => (
                                                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                                                        {new Date(0, i).toLocaleString('es-AR', { month: 'long' })}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="year"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Año</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Año" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {[2024, 2025, 2026].map(year => (
                                                    <SelectItem key={year} value={year.toString()}>
                                                        {year}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <FormLabel>Archivo PDF</FormLabel>
                            {!fileUrl ? (
                                <div className="relative border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-muted-foreground bg-muted/20 hover:bg-muted/40 transition-colors">
                                    <Input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileUpload}
                                        disabled={uploading}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <Upload className="h-8 w-8 mb-2" />
                                    <span className="text-sm">{uploading ? "Subiendo..." : "Arrastra o selecciona un PDF"}</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between p-3 border rounded-md bg-green-50 dark:bg-green-900/20">
                                    <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                                        <FileText className="h-5 w-5" />
                                        <span className="text-sm font-medium truncate max-w-[200px]">
                                            Recibo Subido
                                        </span>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setFileUrl(null)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>

                        <Button type="submit" disabled={loading || uploading || !fileUrl} className="w-full">
                            {loading ? "Cargando..." : "Guardar Recibo"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
