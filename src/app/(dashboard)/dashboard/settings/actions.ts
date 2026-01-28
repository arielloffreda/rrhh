"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const settingsSchema = z.object({
    name: z.string().min(2, "Nombre requerido"),
    taxId: z.string().optional(),
    address: z.string().optional()
})

export type SettingsFormValues = z.infer<typeof settingsSchema>

export async function updateTenantSettings(data: SettingsFormValues) {
    const session = await auth()
    const user = session?.user as any

    if (!user?.id || !user?.tenantId) throw new Error("Unauthorized")
    // Check ADMIN role

    await prisma.tenant.update({
        where: { id: user.tenantId },
        data: {
            name: data.name,
            taxId: data.taxId,
            // Assuming we store address in config Json or add field later. 
            // For now let's just update name and taxId which exist on schema
        }
    })

    revalidatePath('/dashboard/settings')
    return { success: true }
}

export async function getTenantSettings() {
    const session = await auth()
    const user = session?.user as any

    if (!user?.id || !user?.tenantId) throw new Error("Unauthorized")

    const tenant = await prisma.tenant.findUnique({
        where: { id: user.tenantId }
    })

    return tenant
}
