"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { UserRole } from "@prisma/client"
import bcrypt from "bcryptjs"
import { z } from "zod"

const employeeSchema = z.object({
    fullName: z.string().min(2, "Nombre requerido"),
    email: z.string().email("Email inválido"),
    role: z.nativeEnum(UserRole),
    // Optional: initialPassword
})

export type EmployeeFormValues = z.infer<typeof employeeSchema>

export async function getEmployees() {
    const session = await auth()
    const user = session?.user as any

    if (!user?.id) throw new Error("Unauthorized")

    // Check ADMIN role scope if needed

    const employees = await prisma.user.findMany({
        where: {
            tenantId: user.tenantId
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return employees
}

export async function createEmployee(data: EmployeeFormValues) {
    const session = await auth()
    const user = session?.user as any

    if (!user?.id) throw new Error("Unauthorized")
    // Check ADMIN role

    const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
    })

    if (existingUser) {
        throw new Error("El email ya está registrado")
    }

    // Default password for new employees
    const hashedPassword = await bcrypt.hash("123456", 10)

    // ... createEmployee logic above ...

    // Add missing fields to create
    await prisma.user.create({
        data: {
            fullName: data.fullName,
            email: data.email,
            password: hashedPassword,
            role: data.role,
            tenantId: user.tenantId,
            // Initialize empty profile fields if needed, or let them be null
        }
    })

    revalidatePath('/dashboard/employees')
    return { success: true }
}

export async function updateEmployee(id: string, data: Partial<EmployeeFormValues> & {
    jobTitle?: string,
    phone?: string,
    address?: string,
    city?: string,
    state?: string,
    country?: string,
    avatarUrl?: string
}) {
    const session = await auth()
    const user = session?.user as any

    if (!user?.id) throw new Error("Unauthorized")

    // Check if target user belongs to tenant
    const targetUser = await prisma.user.findFirst({
        where: { id, tenantId: user.tenantId }
    })

    if (!targetUser) throw new Error("User not found")

    await prisma.user.update({
        where: { id },
        data: {
            fullName: data.fullName,
            role: data.role,
            // Profile fields
            jobTitle: data.jobTitle,
            phone: data.phone,
            address: data.address,
            city: data.city,
            state: data.state,
            country: data.country,
            avatarUrl: data.avatarUrl,
        }
    })

    revalidatePath('/dashboard/employees')
    return { success: true }
}

export async function deleteEmployee(id: string) {
    const session = await auth()
    const user = session?.user as any
    if (!user?.id) throw new Error("Unauthorized")

    // Verify tenant ownership
    const targetUser = await prisma.user.findFirst({
        where: { id, tenantId: user.tenantId }
    })

    if (!targetUser) throw new Error("User not found")

    await prisma.user.delete({
        where: { id }
    })

    revalidatePath('/dashboard/employees')
    return { success: true }
}

export async function uploadEmployeeAvatar(formData: FormData) {
    const session = await auth()
    const user = session?.user as any
    if (!user?.id) throw new Error("Unauthorized")

    const file = formData.get("file") as File
    if (!file) throw new Error("No file uploaded")

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ext = file.name.split('.').pop() || "png"
    const fileName = `avatar-${Date.now()}.${ext}`

    const fs = require('fs')
    const path = require('path')

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
    }

    const filePath = path.join(uploadDir, fileName)
    fs.writeFileSync(filePath, buffer)

    const avatarUrl = `/uploads/${fileName}`
    return { success: true, avatarUrl }
}
