import { NextResponse } from 'next/server'
import prisma from '@/src/lib/prismadb'
import { Dependent, PeriodBenefit } from '@prisma/client'

interface IParams {
  id?: string
}

export async function GET(request: Request, { params }: { params: IParams }) {
  try {
    const { id } = params

    const house = await prisma.familys.findFirst({
      where: {
        id: id
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

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { id } = params

    const family = await prisma.familys.delete({
      where: {
        id: id
      }
    })

    return NextResponse.json(family)
  } catch (error) {
    console.error(error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}


export const PUT = async (request: Request, { params }: { params: IParams }) => {
  try {
    console.log('Iniciando a atualização');
    const { id: paramId } = params;
    const body = await request.json();
    const {
      id = paramId,
      name,
      CPF,
      RG,
      email,
      phone,
      city,
      neighborhood,
      number,
      state,
      street,
      zip_code,
      notes,
      status,
      dependents,
      periodBenefits,
    } = body;
    console.log('Dados recebidos:', body);  
    if (!id) {
      return new NextResponse('Bad Request', { status: 400 });
    }
    console.log('Atualizando a família com ID:', id); 

    const updatedFamily = await prisma.familys.update({
      where: { id: id },
      data: {
        name,
        CPF,
        RG,
        email,
        phone,
        city,
        neighborhood,
        number,
        state,
        street,
        zip_code,
        notes,
        status,
        updatedAt: new Date(),
        dependents: {
          upsert: dependents.map((dependent: Dependent) => ({
            where: { id: dependent.id },
            update: dependent,
            create: dependent
          }))
        },
        periodBenefit: {
          upsert: periodBenefits.map((periodBenefit: PeriodBenefit) => ({
            where: { id: periodBenefit.id },
            update: periodBenefit,
            create: periodBenefit
          }))
        },
      },
      include: {
        dependents: true,
        periodBenefit: true
      }
    });
    console.log('Família atualizada:', updatedFamily);
    return NextResponse.json(updatedFamily)
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Error', { status: 500 });
  }
};