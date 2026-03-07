"use client"

import { signOut } from "@/app/actions"

const SignOutButton = () => {
  return (
    <button className='btn' onClick={signOut}>
      Sign Out
    </button>
  )
}

export default SignOutButton
