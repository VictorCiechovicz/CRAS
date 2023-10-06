import prisma from '@/src/lib/prismadb';


interface IParams {
  familyId?: string
}

const getFamilyDetails = async ({ familyId }: IParams) => {

  try {


    const family = await prisma.familys.findFirst({
      where: {
        id: familyId
      },
      include: {
        dependents: true,
        periodBenefit: true
      }
    })


    if (!family) {
      return { error: 'No found datails family' }
    }

    return family;
  } catch (error: any) {
    console.error(error)
    return {};
  }
};

export default getFamilyDetails;