"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getTenantSettings() {
    const session = await auth()
    const user = session?.user as any
    if (!user?.tenantId) throw new Error("Unauthorized")

    return await prisma.tenant.findUnique({
        where: { id: user.tenantId }
    })
}

export async function updateOfficeLocation(lat: number, lng: number, address: string, radius: number) {
    const session = await auth()
    const user = session?.user as any
    if (!user?.tenantId) throw new Error("Unauthorized")

    // Check if admin (implement role check if strictly needed, skipping for MVP speed)

    await prisma.tenant.update({
        where: { id: user.tenantId },
        data: {
            officeLat: lat,
            officeLng: lng,
            officeAddress: address,
            officeRadius: radius
        }
    })

    revalidatePath('/dashboard/settings/geolocation')
}
