import Link from "next/link"
import GatewayGamersLogo from "./gateway-gamers-logo"
import SignOutButton from "./sign-out-button"
import ThemeToggle from "./theme-toggle"

interface NavbarProps {
  children: React.ReactNode
  isAdmin?: boolean
  isLoggedIn?: boolean
}

const Navbar: React.FC<NavbarProps> = ({ children, isAdmin, isLoggedIn }) => {
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
            <Link href='/' className='flex items-center gap-2.5'>
              <GatewayGamersLogo className='w-10' />
              <span className='font-bold text-lg tracking-tight hidden sm:inline'>Gateway Gamers</span>
            </Link>
          </div>
          <div className='hidden flex-none lg:block'>
            <ul className='menu menu-horizontal'>
              <li>
                <Link href='/gamekeep'>Game Keep</Link>
              </li>
              <li>
                <Link href='/gamekeep/tracker'>Tracker</Link>
              </li>
              <li>
                <Link href='/friends'>Friends</Link>
              </li>
              <li>
                <Link href='/about'>About</Link>
              </li>
              {isAdmin && (
                <li>
                  <Link href='/admin/users'>Admin</Link>
                </li>
              )}
            </ul>
          </div>
          <ThemeToggle />
          {isLoggedIn && (
            <div className='dropdown dropdown-end ml-2'>
              <div tabIndex={0} role='button' className='btn btn-ghost btn-circle avatar placeholder'>
                <div className='bg-neutral text-neutral-content rounded-full w-9'>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-5 h-5'>
                    <path
                      fillRule='evenodd'
                      d='M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
              </div>
              <ul
                tabIndex={0}
                className='menu menu-sm dropdown-content bg-base-200 rounded-box z-10 mt-3 w-40 p-2 shadow'
              >
                <li>
                  <SignOutButton />
                </li>
              </ul>
            </div>
          )}
        </div>
        {/* Page content here */}
        <div className='container mx-auto px-3 sm:px-6 min-h-screen mt-4'>{children}</div>
      </div>
      <div className='drawer-side'>
        <label htmlFor='my-drawer-3' aria-label='close sidebar' className='drawer-overlay'></label>
        <ul className='menu bg-base-200 min-h-full w-72 max-w-[85vw] p-4'>
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
            <Link href='/friends'>Friends</Link>
          </li>
          <li>
            <Link href='/about'>About</Link>
          </li>
          {isAdmin && (
            <li>
              <Link href='/admin/users'>Admin</Link>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <SignOutButton />
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default Navbar
