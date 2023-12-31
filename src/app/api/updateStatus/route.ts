// pages/api/updateStatus.js

import prisma from '@/src/lib/prismadb';
import { NextResponse } from 'next/server';


export const PUT = async () => {
  try {
    const familias = await prisma.familys.findMany({
      include: {
        periodBenefit: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },

      },
      where: {
        status: {
          in: ['INACTIVE', 'ACTIVE']
        }
      }
    });

    const agora = new Date();
    let updated = 0;

    for (const familia of familias) {
      const periodoBeneficio = familia.periodBenefit[0];

      if (!periodoBeneficio) continue;

      const startDate = new Date(periodoBeneficio.startDate);
      const endDate = new Date(periodoBeneficio.endDate);

      if (agora > endDate && familia.status !== 'INACTIVE') {
        updated++;
        await prisma.familys.update({
          where: { id: familia.id },
          data: { status: 'INACTIVE' },
        });
      } else if ((agora >= startDate && agora <= endDate) || agora < startDate && familia.status !== 'ACTIVE') {
        updated++;
        await prisma.familys.update({
          where: { id: familia.id },
          data: { status: 'ACTIVE' },
        });
      }
    }
    return NextResponse.json({ message: 'Status das famílias atualizado com sucesso.' });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}





