"use client"

import Search from "@/app/components/gamekeep/search"
import ShelfLinks from "@/app/components/gamekeep/shelfLinks"

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className='flex w-full gap-4'>
      <ShelfLinks />
      <div className='flex flex-col flex-1 gap-4'>{children}</div>
    </div>
  )
}

export default Layout
