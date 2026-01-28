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
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
import { toast } from "sonner"
import { updateTenantSettings } from "@/app/(dashboard)/dashboard/settings/actions"

const formSchema = z.object({
    name: z.string().min(2, "Nombre requerido"),
    taxId: z.string().optional(),
})

export function SettingsForm({ initialData }: { initialData: any }) {
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name || "",
            taxId: initialData?.taxId || "",
        }
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setLoading(true)
        try {
            await updateTenantSettings(data)
            toast.success("Configuración actualizada")
        } catch (error: any) {
            toast.error("Error al actualizar configuración")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Información de la Empresa</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre de la Empresa</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Acme Inc" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="taxId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>CUIT / Tax ID</FormLabel>
                                    <FormControl>
                                        <Input placeholder="20-12345678-9" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={loading}>
                            {loading ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
