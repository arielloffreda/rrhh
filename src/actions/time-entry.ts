"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma" // Assuming global prisma client is here, need to verify
import { TimeEntryType, WorkMode } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function getLastEntry(userId?: string) {
    const session = await auth()
    const id = userId || session?.user?.id

    if (!id) return null

    const entry = await prisma.timeEntry.findFirst({
        where: { userId: id },
        orderBy: { timestamp: "desc" },
    })

    return entry
}

export async function getTodayEntries(userId?: string) {
    const session = await auth()
    const id = userId || session?.user?.id

    if (!id) return []

    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    const entries = await prisma.timeEntry.findMany({
        where: {
            userId: id,
            timestamp: {
                gte: startOfDay,
                lte: endOfDay
            }
        },
        orderBy: { timestamp: "desc" },
    })

    return entries
}

export async function clockIn(data: {
    location?: any,
    ipAddress?: string,
    metadata?: any
}) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    // TODO: Verify if last entry was ENTRY (already clocked in)
    const lastEntry = await getLastEntry(session.user.id)
    if (lastEntry && lastEntry.type === TimeEntryType.ENTRY) {
        throw new Error("User already clocked in")
    }

    const tenantId = session.user.tenantId || "default-tenant-id" // Need to handle this properly

    // For now assuming we have a tenantId or fetching it from user
    // Since NextAuth session might not have it populate deeply, we might need to fetch user first
    // But let's assume it's on the user object or we fetch it.

    // Better fetch user to be sure about tenantId if not in session
    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user) throw new Error("User not found")

    await prisma.timeEntry.create({
        data: {
            userId: user.id,
            tenantId: user.tenantId,
            type: TimeEntryType.ENTRY,
            mode: WorkMode.REMOTE, // Make this dynamic later
            timestamp: new Date(),
            location: data.location,
            ipAddress: data.ipAddress,
            metadata: data.metadata,
        }
    })

    revalidatePath("/dashboard")
    return { success: true }
}

export async function clockOut(data: {
    location?: any,
    ipAddress?: string,
    metadata?: any
}) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const lastEntry = await getLastEntry(session.user.id)
    if (!lastEntry || lastEntry.type === TimeEntryType.EXIT) {
        throw new Error("User not clocked in")
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user) throw new Error("User not found")

    await prisma.timeEntry.create({
        data: {
            userId: user.id,
            tenantId: user.tenantId,
            type: TimeEntryType.EXIT,
            mode: WorkMode.REMOTE, // Should match entry or be dynamic
            timestamp: new Date(),
            location: data.location,
            ipAddress: data.ipAddress,
            metadata: data.metadata,
        }
    })

    revalidatePath("/dashboard")
    return { success: true }
}
