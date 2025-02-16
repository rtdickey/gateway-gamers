"use client"

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className='flex w-full gap-4'>
      <div className='flex flex-col flex-1 gap-4'>{children}</div>
    </div>
  )
}

export default Layout
