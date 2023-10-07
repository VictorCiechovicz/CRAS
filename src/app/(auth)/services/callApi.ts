import axios from "axios";


export async function getFamilys() {
  const listFamily = await axios.get('https://cras-wheat.vercel.app/api/familys')
  return listFamily;
}


export async function getFamilyDetails(familyId:string) {
  const listFamilyDetails = await axios.get(
    `https://cras-wheat.vercel.app/api/familys/${familyId}`
  )
  return listFamilyDetails;
}

export async function getFamilysByUser(userId:string) {
  const listFamily = await axios.get(`https://cras-wheat.vercel.app/api/user/${userId}`)
  return listFamily;
}
