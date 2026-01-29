"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function getEmployeeDetails() {
    const session = await auth()
    const user = session?.user as any
    if (!user?.tenantId) return []

    const employees = await prisma.user.findMany({
        where: { tenantId: user.tenantId },
        select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            createdAt: true,
        },
        orderBy: { createdAt: 'desc' }
    })

    return employees.map(e => ({
        ...e,
        createdAt: e.createdAt.toISOString(),
    }))
}

export async function getAbsenceDetails() {
    const session = await auth()
    const user = session?.user as any
    if (!user?.tenantId) return []

    const absences = await prisma.absenceReport.findMany({
        where: { tenantId: user.tenantId },
        include: {
            user: {
                select: { fullName: true, email: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    return absences.map(a => ({
        id: a.id,
        user: a.user.fullName || a.user.email,
        type: a.type,
        status: a.status,
        startDate: a.startDate.toISOString(),
        endDate: a.endDate.toISOString(),
        description: a.description
    }))
}

export async function getTimeEntryDetails() {
    const session = await auth()
    const user = session?.user as any
    if (!user?.tenantId) return []

    const entries = await prisma.timeEntry.findMany({
        where: { tenantId: user.tenantId },
        include: {
            user: {
                select: { fullName: true, email: true }
            }
        },
        orderBy: { timestamp: 'desc' },
        take: 100 // Limit for performance for now
    })

    return entries.map(e => ({
        id: e.id,
        user: e.user.fullName || e.user.email,
        type: e.type,
        timestamp: e.timestamp.toISOString(),
        mode: e.mode,
        isVerified: e.isVerified
    }))
}
