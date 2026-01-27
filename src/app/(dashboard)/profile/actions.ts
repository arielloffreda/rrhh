'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const profileSchema = z.object({
    fullName: z.string().min(2),
    phone: z.string().optional(),
    address: z.string().optional(),
    emergencyContact: z.string().optional(),
})

export type ProfileFormValues = z.infer<typeof profileSchema>

export async function updateProfile(data: ProfileFormValues) {
    const session = await auth()

    if (!session?.user?.id) {
        throw new Error("Unauthorized")
    }

    const userId = session.user.id

    await prisma.user.update({
        where: { id: userId },
        data: {
            fullName: data.fullName,
            profile: {
                phone: data.phone,
                address: data.address,
                emergencyContact: data.emergencyContact,
            } as any // Cast to any to avoid strict JSON typing issues temporarily
        }
    })

    revalidatePath('/profile')
    return { success: true }
}
