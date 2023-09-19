import { Button } from '@/components/common/ui/button'
import { LoginForm } from '@/components/page'

export default function Login() {
  return (
    <>
      <div className=""></div>
      <div className="container relative hidden h-[700px] flex-col items-center justify-center md:grid lg:max-w-none ">


        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Login an account
              </h1>
         
            </div>
            <LoginForm />
          </div>
        </div>
      </div>
    </>
  )
}
