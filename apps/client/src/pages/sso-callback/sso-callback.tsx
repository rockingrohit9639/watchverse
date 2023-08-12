import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Loading from '~/components/loading'
import { useAuthContext } from '~/hooks/use-auth'

export default function SsoCallback() {
  const [searchParams] = useSearchParams()
  const accessToken = searchParams.get('accessToken')
  const navigate = useNavigate()

  const {
    user,
    signInUsingAccessToken: { mutate },
  } = useAuthContext()

  useEffect(() => {
    // Temporary fix for problem caused due to unmount and remount of this component when user
    // becomes available in app shell
    if (user) {
      navigate('/')
    } else if (accessToken) {
      mutate(accessToken, {
        onError: () => {
          navigate('/login')
        },
      })
    } else {
      navigate('/login')
    }
  }, [accessToken, navigate, mutate, user])

  return <Loading>Authenticating User...</Loading>
}
