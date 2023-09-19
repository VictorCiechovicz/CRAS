import { LoginForm } from '@/components/page'
import Image from 'next/image'
import LogoCras from '../../../public/images/logo-cras.png'

export default function Login() {
  return (
    <div className="flex justify-center items-center">
      <div className=" px-10 bg-white w-[448px] h-[500px] rounded-lg shadow-sm ">
        <div className="w-full flex justify-center pt-7 pb-7">
          <Image alt="Logo Cras" src={LogoCras} />
        </div>
        <div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
