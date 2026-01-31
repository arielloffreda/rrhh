const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    const email = process.argv[2] || 'admin@rrhh.com'
    const password = process.argv[3] || 'Admin123!'

    console.log(`Creando tenant y usuario admin...`)
    console.log(`Email: ${email}`)
    console.log(`Pass: ${password}`)

    // 1. Crear Tenant
    const tenant = await prisma.tenant.create({
        data: {
            name: 'Empresa Principal',
            officeAddress: 'Oficina Central',
            officeLat: -34.603722,
            officeLng: -58.381592,
            officeRadius: 500
        }
    })

    console.log(`Tenant creado: ${tenant.name} (${tenant.id})`)

    // 2. Crear Usuario Admin
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: {
            email: email,
            password: hashedPassword,
            fullName: 'Administrador Sistema',
            role: 'COMPANY_ADMIN', // Check enum compatibility
            tenantId: tenant.id
        }
    })

    console.log(`Usuario creado exitosamente!`)
    console.log(`Ya puedes iniciar sesión en la web.`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
