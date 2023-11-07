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
    const { id } = params
    const body = await request.json()

    const { withdrawalBenefit } = body;
    if (!withdrawalBenefit) {
      return new NextResponse('Body Malformated', { status: 400 });
    }
    const periodBenefitFamily = await prisma.periodBenefit.update({
      where: {
        id: id
      },
      data: {
        withdrawalBenefit
      }
    })

    return NextResponse.json(periodBenefitFamily)
  } catch (error) {
    console.error(error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}