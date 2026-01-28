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

    await prisma.user.create({
        data: {
            fullName: data.fullName,
            email: data.email,
            password: hashedPassword,
            role: data.role,
            tenantId: user.tenantId, // Add valid tenantId
        }
    })

    revalidatePath('/dashboard/employees')
    return { success: true }
}
