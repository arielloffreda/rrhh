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
import { useRouter } from "next/navigation"
import { updateTenantSettings, uploadTenantLogo } from "@/app/(dashboard)/dashboard/settings/actions"
// ... imports

const formSchema = z.object({
    name: z.string().min(2, "Nombre requerido"),
    taxId: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
})

export function SettingsForm({ initialData }: { initialData: any }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.logoUrl || null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name || "",
            taxId: initialData?.taxId || "",
            address: initialData?.address || "",
            city: initialData?.city || "",
            state: initialData?.state || "",
            country: initialData?.country || "",
        }
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setLoading(true)
        try {
            // 1. Upload Logo if changed
            if (file) {
                const formData = new FormData()
                formData.append("file", file)
                await uploadTenantLogo(formData)
            }

            // 2. Update Text Settings
            await updateTenantSettings(data)

            toast.success("Configuración guardada")
            router.refresh()
        } catch (error: any) {
            console.error(error)
            toast.error(error.message || "Error al guardar cambios")
        } finally {
            setLoading(false)
        }
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = e.target.files?.[0]
        if (!selectedFile) return

        // Validar tamaño (Max 5MB)
        if (selectedFile.size > 5 * 1024 * 1024) {
            toast.error("El archivo es demasiado grande. Máximo 5MB.")
            e.target.value = "" // Reset input
            setFile(null)
            setPreviewUrl(initialData?.logoUrl || null)
            return
        }

        setFile(selectedFile)
        setPreviewUrl(URL.createObjectURL(selectedFile))
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Información de la Empresa</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-6 flex items-center gap-4">
                    {previewUrl && (
                        <div className="h-16 w-16 relative rounded overflow-hidden">
                            <img src={previewUrl} alt="Logo" className="object-contain w-full h-full" />
                        </div>
                    )}
                    <div className="flex-1">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Logo de la Empresa
                        </label>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <p className="text-[0.8rem] text-muted-foreground mt-1">
                            Selecciona una imagen. Se guardará al hacer click en "Guardar Cambios".
                        </p>
                    </div>
                </div>

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
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Domicilio</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Calle Falsa 123" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Localidad</FormLabel>
                                        <FormControl>
                                            <Input placeholder="CABA" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="state"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Provincia</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Buenos Aires" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>País</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Argentina" {...field} />
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
