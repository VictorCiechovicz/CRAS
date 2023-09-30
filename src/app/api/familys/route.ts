//url=http://localhost:3000/api/familys
import prisma from '@/src/lib/prismadb';
import { NextResponse } from 'next/server';


export const POST = async (request: Request) => {
  try {
    const body = await request.json()
    const {
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
      createdByUserId,
      createdByUserName,
      dependents,
      periodBenefit,
      notes
    } = body;

    if (!name || !CPF || !RG || !email || !phone ||
      !city || !neighborhood || !number || !state ||
      !street || !zip_code || !createdByUserId || !createdByUserName) {
      return new NextResponse('Bad Request', { status: 400 });
    }

    if (dependents && !Array.isArray(dependents)) {
      return new NextResponse('Bad Request', { status: 400 });
    }

    if (periodBenefit && !Array.isArray(periodBenefit)) {
      return new NextResponse('Bad Request', { status: 400 });
    }


    const newFamily = await prisma.familys.create({
      data: {
        name: name,
        CPF: CPF,
        RG: RG,
        email: email,
        phone: phone,
        city: city,
        neighborhood: neighborhood,
        number: number,
        state: state,
        street: street,
        zip_code: zip_code,
        notes: notes,
        createdByUserId: createdByUserId,
        createdByUserName: createdByUserName,
        dependents: {
          create: dependents
        },
        periodBenefit: {
          create: periodBenefit
        }
      }
    });

    return NextResponse.json(newFamily)
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export const GET = async () => {
  try {
    const families = await prisma.familys.findMany({
      include: {
        dependents: true,
        periodBenefit:true
      }
    });

    return NextResponse.json(families);
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

