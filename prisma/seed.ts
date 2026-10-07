import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const modules = [
  'User Management',
  'Role Management',
  'Client Management',
  'Team Management',
  'Module Management',
  'Permission Management',
  'Dashboard',
  'Reports',
  'Notifications',
  'Audit Logs',
  'Settings',
  'Profile Management',
  'Document Management',
  'Activity Management',
  'Support Management',
];

async function seedModules() {
  for (const name of modules) {
    await prisma.module.upsert({
      where: {
        name,
      },
      update: {},
      create: {
        name,
      },
    });
  }

  console.log('15 modules seeded successfully');
}

async function seedSuperAdmin() {
  const name = process.env.SUPER_ADMIN_NAME;
  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!name || !email || !password) {
    throw new Error(
      'SUPER_ADMIN_NAME, SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD are required',
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const superAdmin = await prisma.user.upsert({
    where: {
      email,
    },
    update: {
      name,
      password: hashedPassword,
      userType: 'SUPER_ADMIN',
    },
    create: {
      name,
      email,
      password: hashedPassword,
      userType: 'SUPER_ADMIN',
    },
  });

  console.log(`Super Admin ready: ${superAdmin.email}`);
}

async function main() {
  await seedModules();
  await seedSuperAdmin();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });