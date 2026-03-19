"use client"

interface ContentLayoutProps {
  children: React.ReactNode
}

const ContentLayout: React.FC<ContentLayoutProps> = ({ children }) => {
  return (
    <div className='flex w-full gap-4'>
      <div className='flex flex-col flex-1 gap-4'>{children}</div>
    </div>
  )
}

export default ContentLayout
