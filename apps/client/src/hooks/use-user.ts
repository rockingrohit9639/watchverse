import invariant from 'tiny-invariant'
import { useAuthContext } from './use-auth'

export function useUser() {
  const { user } = useAuthContext()
  invariant(user, 'useUser must be used within protected pages.')
  return { user }
}
