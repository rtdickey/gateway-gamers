import { login } from "./actions"
import GatewayGamersLogo from "@/app/components/common/gateway-gamers-logo"

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ sent?: string }> }) {
  const { sent } = await searchParams

  return (
    <main className='min-h-screen flex items-center justify-center bg-base-200'>
      <div className='card w-full max-w-sm bg-base-100 shadow-xl'>
        <div className='card-body items-center gap-6'>
          <GatewayGamersLogo className='w-28' />

          {sent ? (
            <div className='text-center'>
              <h1 className='text-2xl font-bold'>Check your email</h1>
              <p className='text-base-content/60 text-sm mt-2'>
                We sent a magic link to your inbox. Click it to sign in.
              </p>
            </div>
          ) : (
            <>
              <div className='text-center'>
                <h1 className='text-2xl font-bold'>Welcome to Game Keep</h1>
                <p className='text-base-content/60 text-sm mt-1'>Enter your email to receive a sign-in link</p>
              </div>

              <form className='w-full flex flex-col gap-4'>
                <label className='form-control w-full'>
                  <div className='label'>
                    <span className='label-text'>Email address</span>
                  </div>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    placeholder='you@example.com'
                    className='input input-bordered w-full'
                    required
                  />
                </label>
                <button formAction={login} className='btn btn-primary w-full'>
                  Send Magic Link
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
