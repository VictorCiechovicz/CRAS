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