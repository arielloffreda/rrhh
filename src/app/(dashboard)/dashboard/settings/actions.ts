"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import fs from "fs"
import path from "path"

const settingsSchema = z.object({
    name: z.string().min(2, "Nombre requerido"),
    taxId: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    logoUrl: z.string().optional(),
})

export type SettingsFormValues = z.infer<typeof settingsSchema>

export async function uploadTenantLogo(formData: FormData) {
    console.log("[DEBUG] uploadTenantLogo start")
    try {
        const session = await auth()
        const user = session?.user as any

        console.log("[DEBUG] User:", user?.id, user?.email, user?.tenantId)

        if (!user?.id || !user?.tenantId) {
            console.error("[DEBUG] Unauthorized: Missing user or tenantId")
            throw new Error("Unauthorized")
        }

        const file = formData.get("file") as File
        if (!file) {
            console.error("[DEBUG] No file uploaded")
            throw new Error("No file uploaded")
        }

        console.log("[DEBUG] File received:", file.name, file.size, file.type)

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Ensure unique name
        const ext = file.name.split('.').pop() || "png"
        const fileName = `logo-${user.tenantId}-${Date.now()}.${ext}`

        const uploadDir = path.join(process.cwd(), 'public', 'uploads')
        console.log("[DEBUG] Upload Dir:", uploadDir)

        if (!fs.existsSync(uploadDir)) {
            console.log("[DEBUG] Creating directory...")
            try {
                fs.mkdirSync(uploadDir, { recursive: true })
            } catch (err: any) {
                console.error("[DEBUG] Failed to create dir:", err)
                throw new Error("Failed to create upload directory due to permissions")
            }
        }

        const filePath = path.join(uploadDir, fileName)
        console.log("[DEBUG] Writing to:", filePath)

        try {
            fs.writeFileSync(filePath, buffer)
            console.log("[DEBUG] File written successfully")
        } catch (err: any) {
            console.error("[DEBUG] Write failed:", err)
            throw new Error("Failed to write file to disk")
        }

        const logoUrl = `/uploads/${fileName}`

        console.log("[DEBUG] Updating DB...")
        await prisma.tenant.update({
            where: { id: user.tenantId },
            data: { logoUrl }
        })
        console.log("[DEBUG] DB Updated")

        revalidatePath('/dashboard')
        revalidatePath('/dashboard/settings')
        return { success: true, logoUrl }
    } catch (error: any) {
        console.error("[DEBUG] CRITICAL ERROR IN ACTION:", error)
        throw new Error(`Server Error: ${error.message}`)
    }
}

export async function updateTenantSettings(data: SettingsFormValues) {
    console.log("[DEBUG] updateTenantSettings start", data)
    const session = await auth()
    const user = session?.user as any
    console.log("[DEBUG] User:", user?.id, user?.email, user?.tenantId)

    if (!user?.id || !user?.tenantId) {
        console.error("[DEBUG] Unauthorized update attempt")
        throw new Error("Unauthorized")
    }

    try {
        await prisma.tenant.update({
            where: { id: user.tenantId },
            data: {
                name: data.name,
                taxId: data.taxId,
                address: data.address,
                city: data.city,
                state: data.state,
                country: data.country,
            }
        })
        console.log("[DEBUG] Database updated settings")
    } catch (e) {
        console.error("[DEBUG] DB Update Error (Settings):", e)
        throw e
    }

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
