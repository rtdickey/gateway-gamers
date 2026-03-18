import Image from "next/image"
import GatewayGamersLogo from "./gateway-gamers-logo"

const Footer = () => {
  return (
    <footer className='footer bg-neutral text-neutral-content p-4 mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
      <aside className='flex items-center gap-3'>
        <GatewayGamersLogo className='w-10' />
        <p className='text-sm'>Copyright © {new Date().getFullYear()} - All rights reserved</p>
      </aside>
      <nav>
        <a href='https://boardgamegeek.com/' target='_blank' rel='noreferrer'>
          <Image
            src='/powered_by_bgg.webp'
            alt='Board Game Geek logo'
            width={1200}
            height={352}
            priority
            className='w-32'
          />
        </a>
      </nav>
    </footer>
  )
}

export default Footer
