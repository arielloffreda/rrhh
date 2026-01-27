
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const adminEmail = 'admin@acme.com'

    const user = await prisma.user.findUnique({
        where: { email: adminEmail }
    })

    if (!user) {
        console.log('User not found')
        return
    }

    // Create a Payslip for current month
    const period = new Date()
    period.setDate(1) // 1st of month

    await prisma.payslip.create({
        data: {
            userId: user.id,
            tenantId: user.tenantId,
            period: period,
            fileUrl: "https://example.com/placeholder.pdf", // Dummy
            status: "PENDING"
        }
    })

    console.log('Dummy Payslip created for Admin')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
