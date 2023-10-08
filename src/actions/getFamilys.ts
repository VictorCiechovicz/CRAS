import prisma from '@/src/lib/prismadb';

const getFamilys = async () => {

  try {

    const families = await prisma.familys.findMany({
      include: {
        dependents: true,
        periodBenefit:true
      }
    });

    return families;
  } catch (error: any) {
    console.error(error)
    return [];
  }
};

export default getFamilys;