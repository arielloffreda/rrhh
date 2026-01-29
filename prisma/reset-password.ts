import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = 'admin@local.com'
    const password = await bcrypt.hash('admin123', 10)

    // Find first tenant or create one
    let tenant = await prisma.tenant.findFirst()
    if (!tenant) {
        tenant = await prisma.tenant.create({
            data: { name: "Join Solutions SRL", planType: "ENTERPRISE" }
        })
    }

    // Upsert user
    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password,
            role: UserRole.COMPANY_ADMIN,
            tenantId: tenant.id
        },
        create: {
            email,
            password,
            fullName: "Admin Local",
            role: UserRole.COMPANY_ADMIN,
            tenantId: tenant.id
        }
    })

    console.log(`User ${email} updated with password 'admin123'`)
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
