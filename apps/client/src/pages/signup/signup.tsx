import { Button, Form, Input } from 'antd'
import { useMutation, useQueryClient } from 'react-query'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuthContext } from '~/hooks/use-auth'
import useError from '~/hooks/use-error'
import { signup } from '~/queries/auth'
import { ENV } from '~/utils/env'
import { QUERY_KEYS } from '~/utils/qk'

export default function Signup() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { user } = useAuthContext()
  const { handleError } = useError()

  const signupMutation = useMutation(signup, {
    onError: handleError,
    onSuccess: ({ user, accessToken }) => {
      // saving the token
      localStorage.setItem(ENV.VITE_BEARER_TOKEN_KEY, accessToken)

      // setting the user in state
      queryClient.setQueryData([QUERY_KEYS['logged-in']], user)

      navigate('/', { replace: true })
    },
  })

  if (user) {
    return <Navigate to="/" />
  }

  return (
    <div className="flex items-center justify-center w-full h-screen rounded">
      <Form
        className="min-w-[400px] border px-4 py-6 rounded-md space-y-4"
        autoComplete="off"
        layout="vertical"
        onFinish={signupMutation.mutate}
        disabled={signupMutation.isLoading}
      >
        <div className="text-2xl">
          Welcome back to <span className="text-primary font-bold">Watchverse</span>
        </div>

        <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input your name!' }]}>
          <Input placeholder="Enter your name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please input a valid email!' },
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please input your password!' },
            { min: 5, message: 'Please enter at least 5 characters!' },
            { max: 20, message: 'Please enter not more than 20 characters!' },
          ]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <div className="flex items-center justify-center">
          <Button
            type="primary"
            htmlType="submit"
            loading={signupMutation.isLoading}
            disabled={signupMutation.isLoading}
          >
            Signup
          </Button>
        </div>

        <div className="text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-primary/70">
            Login Now
          </Link>
        </div>
      </Form>
    </div>
  )
}
