import Link from "next/link"
import GatewayGamersLogo from "./components/common/GatewayGamersLogo"

export default function Home() {
  return (
    <div className='grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]'>
      <main className='flex flex-col gap-8 row-start-2 items-center'>
        <GatewayGamersLogo className='w-64' />
        <ol className='list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]'>
          <li className='mb-2'>
            Manage your game closet online with <strong>Game Keep</strong>.
          </li>
          <li className='mb-2'>Track games you lend to your friends.</li>
          <li>Request to borrow a game from your friend.</li>
        </ol>

        <div className='flex gap-4 items-center flex-col sm:flex-row'>
          {/* <a
            className='rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5'
            href='https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image className='dark:invert' src='/vercel.svg' alt='Vercel logomark' width={20} height={20} />
            Deploy now
          </a> */}
          <Link
            className='rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44'
            href='/gamekeep'
          >
            Manage Shelves
          </Link>
        </div>
      </main>
    </div>
  )
}
