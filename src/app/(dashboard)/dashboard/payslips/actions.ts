'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { DocumentStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function getMyPayslips() {
    const session = await auth()
    const user = session?.user as any

    if (!user?.id) return []

    const payslips = await prisma.payslip.findMany({
        where: {
            userId: user.id,
        },
        orderBy: {
            period: 'desc'
        }
    })

    return payslips
}

export async function signPayslip(id: string) {
    const session = await auth()
    const user = session?.user as any

    if (!user?.id) throw new Error("Unauthorized")

    // In a real app, we would capture IP/UserAgent here
    const signMeta = {
        signedBy: user.email,
        method: "DIGITAL_CLICK",
        ip: "127.0.0.1" // Placeholder
    }

    await prisma.payslip.update({
        where: {
            id,
            userId: user.id // Ensure ownership
        },
        data: {
            status: DocumentStatus.SIGNED,
            signedAt: new Date(),
            signMeta
        }
    })

    revalidatePath('/dashboard/payslips')
    return { success: true }
}

export async function uploadPayslip(data: { userId: string, period: Date, fileUrl: string }) {
    const session = await auth()
    const user = session?.user as any

    if (!user?.id) throw new Error("Unauthorized")
    // Check ADMIN role

    // Check if payslip already exists for period
    const existing = await prisma.payslip.findFirst({
        where: {
            userId: data.userId,
            period: data.period
        }
    })

    if (existing) throw new Error("Payslip already exists for this period")

    // Get tenantId from user to be safe
    const targetUser = await prisma.user.findUnique({ where: { id: data.userId } })
    if (!targetUser) throw new Error("Target user not found")

    await prisma.payslip.create({
        data: {
            userId: data.userId,
            tenantId: targetUser.tenantId,
            period: data.period,
            fileUrl: data.fileUrl,
            status: DocumentStatus.PENDING
        }
    })

    revalidatePath('/dashboard/admin/payslips')
    revalidatePath('/dashboard/payslips')
    return { success: true }
}

export async function getAllUsers() {
    const session = await auth()
    if (!session?.user) return []

    const users = await prisma.user.findMany({
        select: { id: true, fullName: true, email: true },
        orderBy: { fullName: 'asc' }
    })
    return users
}
