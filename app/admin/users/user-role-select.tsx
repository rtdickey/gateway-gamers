"use client"

import { AppRole } from "@/database.types"
import { updateUserRole } from "@/app/admin/actions"
import { useState } from "react"

interface UserRoleSelectProps {
  userId: string
  currentRole: AppRole
}

const ROLES: AppRole[] = ["user", "contributor", "admin"]

const UserRoleSelect: React.FC<UserRoleSelectProps> = ({ userId, currentRole }) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsLoading(true)
    await updateUserRole(userId, e.target.value as AppRole)
    setIsLoading(false)
  }

  return (
    <select className='select select-sm' defaultValue={currentRole} onChange={handleChange} disabled={isLoading}>
      {ROLES.map(role => (
        <option key={role} value={role}>
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </option>
      ))}
    </select>
  )
}

export default UserRoleSelect
