import Link from "next/link"
import Image from "next/image"
import GatewayGamersLogo from "./GatewayGamersLogo"

interface NavbarProps {
  children: React.ReactNode
}

const Navbar: React.FC<NavbarProps> = ({ children }) => {
  return (
    <div className='drawer'>
      <input id='my-drawer-3' type='checkbox' className='drawer-toggle' />
      <div className='drawer-content flex flex-col'>
        {/* Navbar */}
        <div className='navbar bg-base-300 w-full'>
          <div className='flex-none lg:hidden'>
            <label htmlFor='my-drawer-3' aria-label='open sidebar' className='btn btn-square btn-ghost'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                className='inline-block h-6 w-6 stroke-current'
              >
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h16'></path>
              </svg>
            </label>
          </div>
          <div className='mx-2 flex-1 px-2'>
            <Link href='/'>
              <GatewayGamersLogo className='w-14' />
            </Link>
          </div>
          <div className='hidden flex-none lg:block'>
            <ul className='menu menu-horizontal'>
              {/* Navbar menu content here */}
              <li>
                <Link href='/gamekeep'>Game Keep</Link>
              </li>
              <li>
                <Link href='/gamekeep/tracker'>Tracker</Link>
              </li>
              <li>
                <Link href='/about'>About</Link>
              </li>
            </ul>
          </div>
        </div>
        {/* Page content here */}
        <div className='container mx-auto px-6 min-h-screen justify-between mt-4'>{children}</div>
      </div>
      <div className='drawer-side'>
        <label htmlFor='my-drawer-3' aria-label='close sidebar' className='drawer-overlay'></label>
        <ul className='menu bg-base-200 min-h-full w-80 p-4'>
          {/* Sidebar content here */}
          <Link href='/'>
            <GatewayGamersLogo className='w-20 justify-self-center mb-4' />
          </Link>
          <li>
            <Link href='/gamekeep'>Game Keep</Link>
          </li>
          <li>
            <Link href='/gamekeep/tracker'>Tracker</Link>
          </li>
          <li>
            <Link href='/about'>About</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Navbar
