import { message } from 'antd'
import constate from 'constate'
import { useCallback } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { fetchLoggedInUser, login } from '~/queries/auth'
import { ENV } from '~/utils/env'
import { getErrorMessage } from '~/utils/error'
import { QUERY_KEYS } from '~/utils/qk'

export function useAuth() {
  const queryClient = useQueryClient()

  const {
    isLoading: authVerificationInProgress,
    data: user,
    remove: removeUserData,
    refetch: refetchUserData,
  } = useQuery([QUERY_KEYS['logged-in']], fetchLoggedInUser, {
    retry: false,
  })

  const loginMutation = useMutation(login, {
    onSuccess: (data) => {
      message.success('Successfully logged in')
      // save the token in localStorage for further usage
      window.localStorage.setItem(ENV.VITE_BEARER_TOKEN_KEY, data.accessToken)

      // update the user in the queryClient, so that you would automatically get user from useAuthContext
      queryClient.setQueryData([QUERY_KEYS['logged-in']], data.user)
    },
    onError: (error) => {
      message.error(getErrorMessage(error))
    },
  })

  const logout = useCallback(() => {
    window.localStorage.removeItem(ENV.VITE_BEARER_TOKEN_KEY)
    removeUserData()
    refetchUserData()
  }, [removeUserData, refetchUserData])

  return {
    authVerificationInProgress,
    user,
    loginMutation,
    logout,
  }
}

export const [AuthProvider, useAuthContext] = constate(useAuth)
