import { NextResponse } from 'next/server'
import prisma from '@/src/lib/prismadb'

interface IParams {
  id?: string
}


export async function PUT(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { id } = params;
    const body = await request.json();


    const { withdrawalBenefitToRemove } = body;


    const currentPeriodBenefit = await prisma.periodBenefit.findUnique({
      where: { id }
    });

    if (!currentPeriodBenefit) {
      return new NextResponse('PeriodBenefit not found', { status: 404 });
    }

    const updatedWithdrawalBenefits = currentPeriodBenefit.withdrawalBenefit.filter(
      date => date.toISOString() !== withdrawalBenefitToRemove
    );


    const updatedPeriodBenefit = await prisma.periodBenefit.update({
      where: { id },
      data: {
        withdrawalBenefit: updatedWithdrawalBenefits
      }
    });

    return NextResponse.json(updatedPeriodBenefit);
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
