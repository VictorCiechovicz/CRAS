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
    const { id } = params;
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
      createdByUserId,
      createdByUserName,
      dependents,
      periodBenefit,
      status,
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
      !createdByUserId ||
      !createdByUserName ||
      !dependents ||
      !periodBenefit ||
      !status
    ) {
      return new NextResponse('Body Malformated', { status: 400 });
    }

    if (dependents && !Array.isArray(dependents)) {
      return new NextResponse('Bad Request', { status: 400 });
    }

    if (periodBenefit && !Array.isArray(periodBenefit)) {
      return new NextResponse('Bad Request', { status: 400 });
    }


    if (!id) {
      return new NextResponse('Bad Request', { status: 400 });
    }

    const existingDependents = dependents.filter((dep: Dependent) => dep.id);
    const newDependents = dependents.filter((dep: Dependent) => !dep.id);

    const existingPeriodBenefits = periodBenefit.filter((period: PeriodBenefit) => period.id);
    const newPeriodBenefits = periodBenefit.filter((period: PeriodBenefit) => !period.id);



    const updatedFamily = await prisma.familys.update({
      where: { id },
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
        createdByUserId,
        createdByUserName,
        notes,
        status,
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
        updatedAt: new Date(),
        dependents: {
          update: existingDependents.map((dep: Dependent) => ({
            where: { id: dep.id },
            data: {
              name_dependent: dep.name_dependent,
              CPF_dependent: dep.CPF_dependent,
              date_birth_dependent: dep.date_birth_dependent,
              income_dependent: dep.income_dependent,
              maritial_status_dependent: dep.maritial_status_dependent,
              profession_dependent: dep.profession_dependent,
              kinship_dependent: dep.kinship_dependent,
              schooling_dependent: dep.schooling_dependent,
              type_income_dependent: dep.type_income_dependent,
              nis_dependent: dep.nis_dependent
            },
          })),
          create: newDependents.map((dep: Dependent) => ({
            name_dependent: dep.name_dependent,
            CPF_dependent: dep.CPF_dependent,
            date_birth_dependent: dep.date_birth_dependent,
            income_dependent: dep.income_dependent,
            maritial_status_dependent: dep.maritial_status_dependent,
            profession_dependent: dep.profession_dependent,
            kinship_dependent: dep.kinship_dependent,
            schooling_dependent: dep.schooling_dependent,
            type_income_dependent: dep.type_income_dependent,
            nis_dependent: dep.nis_dependent
          })),
        },
        periodBenefit: {
          update: existingPeriodBenefits.map((period: PeriodBenefit) => ({
            where: { id: period.id },
            data: {
              startDate: period.startDate,
              endDate: period.endDate,
            },
          })),
          create: newPeriodBenefits.map((period: PeriodBenefit) => ({
            startDate: period.startDate,
            endDate: period.endDate,
          })),
        },
      },
      include: {
        dependents: true,
        periodBenefit: true,
      },
    });



    return NextResponse.json(updatedFamily);
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Error', { status: 500 });
  }
};
