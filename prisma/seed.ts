import { PrismaClient, UserRole, WorkMode } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const password = await bcrypt.hash('admin123', 10)

    // Create Tenant
    const tenant = await prisma.tenant.create({
        data: {
            name: 'Acme Corp',
            planType: 'ENTERPRISE',
            users: {
                create: {
                    email: 'admin@acme.com',
                    fullName: 'Admin User',
                    password,
                    role: UserRole.COMPANY_ADMIN,
                }
            }
        },
        include: {
            users: true
        }
    })

    const admin = tenant.users[0];

    console.log({ tenant, admin })
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
