import prisma from '@/src/lib/prismadb';


interface IParams {
  userId?: string
}

const getFamilysByUser = async ({ userId }: IParams) => {

  try {


    const familys = await prisma.familys.findMany({
      where: {
        createdByUserId: userId
      },
      include: {
        dependents: true,
        periodBenefit: true
      }
    })

    if (!familys) {
      return { error: 'No families found with user' }
    }

    return familys;
  } catch (error: any) {
    console.error(error)
    return [];
  }
};

export default getFamilysByUser;