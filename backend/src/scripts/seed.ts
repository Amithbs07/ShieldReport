import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateCaseToken } from '../utils/token';
import { encrypt } from '../utils/encryption';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding ShieldReport Database...');

  // 1. Create a Demo Organization
  const org = await prisma.organization.upsert({
    where: { slug: 'acme-corp' },
    update: {},
    create: {
      name: 'Acme Corporation',
      slug: 'acme-corp',
    },
  });

  // 2. Create Demo Admin
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { email: 'investigator@acme.com' },
    update: {},
    create: {
      email: 'investigator@acme.com',
      passwordHash,
      role: 'ADMIN',
      organizationId: org.id
    }
  });

  // 3. Create Sample Reports
  const reports = [
    {
      category: 'Workplace Harassment',
      severity: 'High',
      description: 'Repeated inappropriate comments in the sales department channel.',
      aiUrgencyScore: 85,
      aiSummary: 'Repeated verbal harassment reported in the sales department.',
      aiTags: 'Harassment, Sales, Verbal'
    },
    {
      category: 'Community Safety',
      severity: 'Critical',
      description: 'Emergency exit in Warehouse B was bolted shut by the floor manager yesterday afternoon.',
      aiUrgencyScore: 98,
      aiSummary: 'Emergency exit illegally bolted shut in Warehouse B.',
      aiTags: 'Safety Violation, Critical, Warehouse'
    }
  ];

  for (const r of reports) {
    await prisma.report.create({
      data: {
        caseToken: generateCaseToken(),
        category: r.category,
        severity: r.severity,
        description: encrypt(r.description),
        organizationId: org.id,
        aiUrgencyScore: r.aiUrgencyScore,
        aiSummary: r.aiSummary,
        aiTags: r.aiTags,
        status: r.severity === 'Critical' ? 'UNDER_REVIEW' : 'SUBMITTED'
      }
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
