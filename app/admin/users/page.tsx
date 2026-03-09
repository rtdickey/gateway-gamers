import { getUsers } from "@/app/admin/actions"
import UserRoleSelect from "./user-role-select"

const UsersPage = async () => {
  const users = await getUsers()

  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h1 className='text-2xl font-bold'>User Management</h1>
        <p className='text-base-content/60 text-sm mt-1'>Manage user roles and access levels.</p>
      </div>
      <div className='overflow-x-auto'>
        <table className='table'>
          <thead>
            <tr>
              <th>Email</th>
              <th>Display Name</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.email ?? <span className='text-base-content/40 italic'>No email</span>}</td>
                <td>{user.display_name ?? <span className='text-base-content/40 italic'>Not set</span>}</td>
                <td>
                  <UserRoleSelect userId={user.id} currentRole={user.role} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p className='text-center text-base-content/40 py-8'>No users found.</p>}
      </div>
    </div>
  )
}

export default UsersPage
