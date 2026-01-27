'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { TimeEntryType, WorkMode } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function logTimeEntry(type: TimeEntryType, location?: { lat: number; lng: number }) {
    const session = await auth()
    const user = session?.user as any

    if (!user?.id || !user?.tenantId) {
        throw new Error("Unauthorized")
    }

    // Basic logic: If location provided, store it.
    // We assume REMOTE for now as per plan, or could infer later.

    await prisma.timeEntry.create({
        data: {
            userId: user.id,
            tenantId: user.tenantId,
            type,
            mode: WorkMode.REMOTE, // Defaulting to REMOTE per plan
            timestamp: new Date(),
            location: location ? location : undefined,
            isVerified: true // Auto-verify for now
        }
    })

    revalidatePath('/dashboard/time-tracking')
    revalidatePath('/dashboard') // Update quick stats
    return { success: true }
}

export async function getTodayEntries() {
    const session = await auth()
    const user = session?.user as any

    if (!user?.id) return []

    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    const entries = await prisma.timeEntry.findMany({
        where: {
            userId: user.id,
            timestamp: {
                gte: startOfDay,
                lte: endOfDay
            }
        },
        orderBy: {
            timestamp: 'asc' // Oldest first to show timeline
        }
    })

    return entries
}

export async function getLastEntry() {
    const session = await auth()
    const user = session?.user as any

    if (!user?.id) return null

    const entry = await prisma.timeEntry.findFirst({
        where: {
            userId: user.id
        },
        orderBy: {
            timestamp: 'desc'
        }
    })
    return entry
}
