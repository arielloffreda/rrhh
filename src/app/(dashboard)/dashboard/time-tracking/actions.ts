'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { TimeEntryType, WorkMode } from "@prisma/client"
import { revalidatePath } from "next/cache"

const MAX_DISTANCE_METERS_DEFAULT = 300

function getDistanceFromLatLonInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371e3; // Radius of the earth in meters
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in meters
    return d;
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180)
}

export async function logTimeEntry(type: TimeEntryType, mode: WorkMode, location?: { lat: number; lng: number }) {
    const session = await auth()
    const currentUser = session?.user as any

    if (!currentUser?.id || !currentUser?.tenantId) {
        throw new Error("Unauthorized")
    }

    // Fetch User and Tenant Configuration for Geolocation
    const user = await prisma.user.findUnique({
        where: { id: currentUser.id },
        include: { tenant: true }
    })

    if (!user) throw new Error("User not found")

    let isVerified = true
    let verificationNote = ""

    // Validation Logic
    if (mode === 'PRESENTIAL') {
        if (!location) {
            throw new Error("Para fichar en Oficina es OBLIGATORIO permitir la ubicación.")
        }

        const officeLat = user.tenant.officeLat
        const officeLng = user.tenant.officeLng
        const radius = user.tenant.officeRadius || MAX_DISTANCE_METERS_DEFAULT

        if (officeLat === null || officeLng === null) {
            // If office location is not set, we can't block, but we should warn admin
            // For now, allow but mark as unverified
            isVerified = false
            verificationNote = "Ubicación de Oficina no configurada en el sistema."
        } else {
            const distance = getDistanceFromLatLonInMeters(
                location.lat,
                location.lng,
                officeLat,
                officeLng
            )

            if (distance > radius) {
                throw new Error(`Estás a ${Math.round(distance)}m de la oficina. Debes estar a menos de ${radius}m.`)
            }
        }
    } else if (mode === 'REMOTE') {
        // Optional: Validate Home Office Location if user has it set
        if (location && user.homeLat && user.homeLng) {
            const distance = getDistanceFromLatLonInMeters(
                location.lat,
                location.lng,
                user.homeLat,
                user.homeLng
            )
            // We give a bit more flexibility for home (e.g. 500m or just log it)
            if (distance > 500) {
                isVerified = false;
                verificationNote = `Ubicación difiere de Home Office registrado (${Math.round(distance)}m)`
            }
        }
    }

    await prisma.timeEntry.create({
        data: {
            userId: user.id,
            tenantId: user.tenantId,
            type,
            mode: mode,
            timestamp: new Date(),
            location: location ? location : undefined,
            isVerified: isVerified,
            metadata: verificationNote ? { note: verificationNote } : undefined
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
