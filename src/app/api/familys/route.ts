//url=http://localhost:3000/api/familys
import prisma from '@/src/lib/prismadb';
import { Dependent } from '@prisma/client'
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
        dependents: true
      }
    });

    return NextResponse.json(families);
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export const PUT = async (request: Request) => {
  try {
    const body = await request.json();
    const {
      id,
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
      dependents,
      dependentsToDelete
    } = body;

    if (!id) {
      return new NextResponse('Bad Request', { status: 400 });
    }

    // Preparar os dados dos dependentes para a atualização
    const dependentsData = {
      // Atualizar dependentes existentes
      update: dependents.filter((dep: Dependent) => dep.id).map((dep: Dependent) => ({
        where: { id: dep.id },
        data: dep
      })),
      // Adicionar novos dependentes
      create: dependents.filter((dep: Dependent) => !dep.id),
      // Excluir dependentes
      deleteMany: dependentsToDelete ? dependentsToDelete.map((depId: any) => ({ id: depId })) : undefined
    };

    const updatedFamily = await prisma.familys.update({
      where: { id: id },
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
        dependents: dependentsData
      }
    });

    return NextResponse.json(updatedFamily);
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
