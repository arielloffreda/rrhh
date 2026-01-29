const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = process.argv[2];
    const newPassword = process.argv[3] || '123456';

    if (!email) {
        console.log('Please provide an email address.');
        console.log('Usage: node scripts/set-password.js <email> [password]');
        return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    try {
        const user = await prisma.user.update({
            where: { email },
            data: { password: hashedPassword },
        });
        console.log(`Password for user ${email} has been updated to: ${newPassword}`);
    } catch (error) {
        if (error.code === 'P2025') {
            console.error(`User with email ${email} not found.`);
        } else {
            console.error('Error updating password:', error);
        }
    } finally {
        await prisma.$disconnect();
    }
}

main();
