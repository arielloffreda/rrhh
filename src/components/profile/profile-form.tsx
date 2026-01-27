"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { updateProfile } from "@/app/(dashboard)/profile/actions"
import { useState } from "react"
// import { UserRole } from "@prisma/client"

const profileSchema = z.object({
    fullName: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    phone: z.string().optional(),
    address: z.string().optional(),
    emergencyContact: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface ProfileFormProps {
    user: {
        fullName: string | null
        email: string | null
        role: string
        profile: any
    }
}

export function ProfileForm({ user }: ProfileFormProps) {
    const [loading, setLoading] = useState(false)

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: user.fullName || "",
            phone: user.profile?.phone || "",
            address: user.profile?.address || "",
            emergencyContact: user.profile?.emergencyContact || "",
        },
    })

    async function onSubmit(data: ProfileFormValues) {
        setLoading(true)
        try {
            await updateProfile(data)
            toast.success("Perfil actualizado correctamente")
        } catch (error) {
            toast.error("Algo salió mal.")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
                <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre Completo</FormLabel>
                                <FormControl>
                                    <Input placeholder="Juan Perez" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
                        <Input value={user.email || ''} disabled className="bg-muted" />
                        <p className="text-[0.8rem] text-muted-foreground">Contacta al administrador para cambiar el email.</p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Rol</label>
                        <Input value={user.role} disabled className="bg-muted" />
                    </div>
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Teléfono</FormLabel>
                                <FormControl>
                                    <Input placeholder="+54 9 11 1234 5678" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Dirección</FormLabel>
                            <FormControl>
                                <Input placeholder="Av. Corrientes 1234, CABA" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="emergencyContact"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Contacto de Emergencia</FormLabel>
                            <FormControl>
                                <Input placeholder="Nombre - Teléfono" {...field} />
                            </FormControl>
                            <FormDescription>
                                ¿A quién debemos contactar en caso de emergencia?
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={loading}>
                    {loading ? "Guardando..." : "Actualizar Perfil"}
                </Button>
            </form>
        </Form>
    )
}
