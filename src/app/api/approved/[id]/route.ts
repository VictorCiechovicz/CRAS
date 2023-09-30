import { NextResponse } from 'next/server'
import prisma from '@/src/lib/prismadb'


interface IParams {
  id?: string
}


export const PUT = async (request: Request, { params }: { params: IParams }) => {
  try {

    const { id } = params;
    const body = await request.json();
    const { status } = body;

    if (!id || !status) {
      return new NextResponse('Bad Request', { status: 400 });
    }
    const updatedSatusFamily = await prisma.familys.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedSatusFamily)
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Error', { status: 500 });
  }
};