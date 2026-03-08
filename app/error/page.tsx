"use client"

import { useSearchParams } from "next/navigation"

export default function ErrorPage() {
  const params = useSearchParams()
  const message = params.get("message")
  const status = params.get("status")

  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-2'>
      <p className='text-lg font-semibold'>Sorry, something went wrong</p>
      {message && (
        <p className='text-sm text-error'>
          {status && <span className='font-mono'>[{status}]</span>} {message}
        </p>
      )}
    </div>
  )
}
