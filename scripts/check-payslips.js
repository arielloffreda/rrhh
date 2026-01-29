const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const searchTerm = 'Claudio';

    console.log(`Searching for users matching '${searchTerm}'...`);
    const users = await prisma.user.findMany({
        where: {
            fullName: {
                contains: searchTerm
            }
        }
    });

    if (users.length === 0) {
        console.log('No users found.');
        return;
    }

    for (const user of users) {
        console.log(`\nUser: ${user.fullName} (${user.email}) - ID: ${user.id}`);

        const payslips = await prisma.payslip.findMany({
            where: {
                userId: user.id
            }
        });

        if (payslips.length === 0) {
            console.log('  No payslips found.');
        } else {
            console.log(`  Found ${payslips.length} payslips:`);
            payslips.forEach(p => {
                console.log(`    - ID: ${p.id}`);
                console.log(`      Period: ${p.period} (ISO: ${p.period.toISOString()})`);
                console.log(`      File: ${p.fileUrl}`);
                console.log(`      Created: ${p.createdAt}`);
            });
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
