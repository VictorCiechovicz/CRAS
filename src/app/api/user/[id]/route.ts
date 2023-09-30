import { NextResponse } from 'next/server'
import prisma from '@/src/lib/prismadb'

interface IParams {
  id?: string
}

export async function GET(request: Request, { params }: { params: IParams }) {
  try {
    const { id } = params

    const house = await prisma.familys.findMany({
      where: {
        createdByUserId: id
      },
      include: {
        dependents: true,
        periodBenefit: true
      }
    })

    if (!house) {
      return new NextResponse('Not Found', { status: 404 })
    }

    return NextResponse.json(house)
  } catch (error) {
    console.error(error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}