'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { AbsenceType, AbsenceStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const absenceSchema = z.object({
    type: z.nativeEnum(AbsenceType),
    startDate: z.date(),
    endDate: z.date(),
    description: z.string().optional(),
})

export type AbsenceFormValues = z.infer<typeof absenceSchema>

export async function requestAbsence(data: AbsenceFormValues) {
    const session = await auth()
    const user = session?.user as any

    if (!user?.id || !user?.tenantId) {
        throw new Error("Unauthorized")
    }

    await prisma.absenceReport.create({
        data: {
            userId: user.id,
            tenantId: user.tenantId,
            type: data.type,
            startDate: data.startDate,
            endDate: data.endDate,
            description: data.description,
            status: AbsenceStatus.PENDING
        }
    })

    revalidatePath('/dashboard/absences')
    revalidatePath('/dashboard') // Update quick stats
    return { success: true }
}

export async function getMyAbsences() {
    const session = await auth()
    const user = session?.user as any

    if (!user?.id) return []

    const absences = await prisma.absenceReport.findMany({
        where: {
            userId: user.id,
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return absences
}

export async function getPendingAbsences() {
    const session = await auth()
    const user = session?.user as any

    if (!user?.id) throw new Error("Unauthorized")

    // In real app, check for ADMIN role
    // if (user.role !== 'HR_ADMIN') throw new Error("Forbidden")

    const absences = await prisma.absenceReport.findMany({
        where: {
            status: AbsenceStatus.PENDING,
            // tenantId: user.tenantId // Filter by tenant
        },
        include: {
            user: {
                select: {
                    fullName: true,
                    email: true
                }
            }
        },
        orderBy: {
            createdAt: 'asc'
        }
    })

    return absences
}

export async function updateAbsenceStatus(id: string, status: AbsenceStatus) {
    const session = await auth()
    const user = session?.user as any

    if (!user?.id) throw new Error("Unauthorized")

    await prisma.absenceReport.update({
        where: { id },
        data: { status }
    })

    revalidatePath('/dashboard/admin/absences')
    revalidatePath('/dashboard/absences')
    return { success: true }
}
