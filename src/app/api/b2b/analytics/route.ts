import { NextResponse } from 'next/server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get organization members
  const members = await prisma.organizationMember.findMany({
    where: {
      organizationId: session.user.organizationId
    },
    select: {
      userId: true
    }
  });
  const memberIds = members.map((m: {userId: string}) => m.userId);

  // Get aggregated financial data for organization members
  const financialData = await prisma.userProfile.aggregate({
    where: {
      id: { in: memberIds }
    },
    _avg: {
      financialHealthScore: true
    },
    _count: true
  });

  // Get spending breakdown by category
  const spendingByCategory = await prisma.transaction.groupBy({
    by: ['categoryId'],
    where: {
      userId: { in: memberIds }
    },
    _sum: {
      amount: true
    },
    _count: true
  });

  return NextResponse.json({
    averageFinancialHealth: financialData._avg.financialHealthScore || 0,
    memberCount: financialData._count,
    spendingByCategory: spendingByCategory.map(c => ({
      categoryId: c.categoryId || 'uncategorized',
      totalAmount: c._sum.amount?.toNumber() || 0,
      transactionCount: c._count
    }))
  });
}
