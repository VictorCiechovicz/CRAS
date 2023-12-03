import { NextResponse } from 'next/server'
import prisma from '@/src/lib/prismadb'

interface IParams {
  id?: string
}


export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { id } = params

    const periodBenefitFamily = await prisma.periodBenefit.delete({
      where: {
        id: id
      }
    })

    return NextResponse.json(periodBenefitFamily)
  } catch (error) {
    console.error(error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const { withdrawalBenefit: newWithdrawalBenefits } = body;
    if (!Array.isArray(newWithdrawalBenefits)) {
      return new NextResponse('Body Malformatted: withdrawalBenefit must be an array', { status: 400 });
    }

    const currentPeriodBenefit = await prisma.periodBenefit.findUnique({
      where: { id }
    });

    if (!currentPeriodBenefit) {
      return new NextResponse('PeriodBenefit not found', { status: 404 });
    }

    const updatedWithdrawalBenefits = [
      ...(currentPeriodBenefit.withdrawalBenefit || []),
      ...newWithdrawalBenefits
    ];

    const periodBenefitFamily = await prisma.periodBenefit.update({
      where: { id },
      data: {
        withdrawalBenefit: updatedWithdrawalBenefits
      }
    });

    return NextResponse.json(periodBenefitFamily);
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
