
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@methode.com';
  const password = 'admin'; // Simple password for dev
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const admin = await prisma.admin.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: 'Super Admin',
      password: hashedPassword,
      role: 'superadmin'
    },
  });
  
  console.log({ admin });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
