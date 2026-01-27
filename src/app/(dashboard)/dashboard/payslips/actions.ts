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
