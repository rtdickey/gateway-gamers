import getUser from "../actions"

export default async function PrivatePage() {
  const { user } = await getUser()

  return <p>Hello {user.email}!!!</p>
}
