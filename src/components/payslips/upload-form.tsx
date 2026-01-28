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
import { Upload } from "lucide-react"

const formSchema = z.object({
    userId: z.string().min(1, "Seleccione un empleado"),
    month: z.string().min(1, "Seleccione un mes"),
    year: z.string().min(4, "Seleccione un año"),
    // file: z.any() // In real app we validate file
})

export function UploadPayslipForm({ users }: { users: any[] }) {
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            year: new Date().getFullYear().toString()
        }
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setLoading(true)
        try {
            // Construct date from month/year (first day of month)
            const period = new Date(parseInt(data.year), parseInt(data.month) - 1, 1)

            // Simulate file upload - In real app we upload to S3 here and get URL
            const fakeUrl = `https://saas-rrhh-bucket.s3.amazonaws.com/payslips/${data.userId}/${period.toISOString()}.pdf`

            await uploadPayslip({
                userId: data.userId,
                period: period,
                fileUrl: fakeUrl
            })

            toast.success("Recibo cargado correctamente")
            form.reset()
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
                            <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-muted-foreground bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
                                <Upload className="h-8 w-8 mb-2" />
                                <span className="text-sm">Haga clic para seleccionar (Simulado)</span>
                            </div>
                        </div>

                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? "Cargando..." : "Subir Recibo"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
