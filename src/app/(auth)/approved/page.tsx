import { ApprovedList } from "@/src/components/page"
import axios from "axios"



export default async function Approved() {

  const listFamily = await axios.get('/api/familys')
  return (
    <div className="w-full">
      <ApprovedList items={listFamily.data} />
    </div>
  )
}
