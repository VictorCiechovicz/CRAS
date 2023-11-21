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
      notes,
      notes_reprove,
      date_birth_responsible,
      profession_responsible,
      nis_responsible,
      type_residence,
      is_bathroom,
      type_house,
      length_of_residence,
      is_bolsa_familia,
      value_bolsa_familia,
      BPC,
      social_assistance_program,
      is_single_cadastre,
      date_visited,
      schooling_responsible,
      income_responsible,
      type_income_responsible,
      maritial_status_responsible
    } = body;

    if (
      !name ||
      !CPF ||
      !RG ||
      !phone ||
      !city ||
      !neighborhood ||
      !number ||
      !state ||
      !street ||
      !zip_code ||
      !createdByUserId ||
      !createdByUserName ||
      !date_birth_responsible ||
      !profession_responsible ||
      !type_residence ||
      !is_bathroom ||
      !type_house ||
      !length_of_residence ||
      !is_bolsa_familia ||
      !BPC ||
      !social_assistance_program ||
      !is_single_cadastre ||
      !date_visited ||
      !schooling_responsible ||
      !income_responsible ||
      !type_income_responsible ||
      !maritial_status_responsible
    ) {
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
        name,
        CPF,
        RG,
        phone,
        city,
        neighborhood,
        number,
        state,
        street,
        zip_code,
        notes,
        notes_reprove,
        date_birth_responsible,
        profession_responsible,
        nis_responsible,
        type_residence,
        is_bathroom,
        type_house,
        length_of_residence,
        is_bolsa_familia,
        value_bolsa_familia,
        BPC,
        social_assistance_program,
        is_single_cadastre,
        date_visited,
        schooling_responsible,
        income_responsible,
        type_income_responsible,
        maritial_status_responsible,
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
        periodBenefit: true
      }
    });

    return NextResponse.json(families);
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

