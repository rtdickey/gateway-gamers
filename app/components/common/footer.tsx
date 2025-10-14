import Image from "next/image"
import GatewayGamersLogo from "./gateway-gamers-logo"

const Footer = () => {
  return (
    <footer className='footer bg-neutral text-neutral-content items-center p-4 mt-4'>
      <aside className='grid-flow-col items-center'>
        <GatewayGamersLogo className='w-12' />
        <p>Copyright © {new Date().getFullYear()} - All rights reserved</p>
      </aside>
      <nav className='grid-flow-col gap-4 md:place-self-center md:justify-self-end'>
        <a href='https://boardgamegeek.com/' target='_blank' rel='noreferrer'>
          <Image
            src='/powered_by_bgg.webp'
            alt='Board Game Geek logo'
            width={1200}
            height={352}
            priority
            className='w-40'
          />
        </a>
      </nav>
    </footer>
  )
}

export default Footer
