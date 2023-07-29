import { Button, Form, Input } from 'antd'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { useAuthContext } from '~/hooks/use-auth'

export default function Login() {
  const { user, loginMutation } = useAuthContext()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? '/'

  if (user) {
    return <Navigate to={{ pathname: redirectTo }} replace />
  }

  return (
    <div className="flex items-center justify-center w-full h-screen rounded">
      <Form
        className="min-w-[400px] border px-4 py-6 rounded-md space-y-4"
        autoComplete="off"
        layout="vertical"
        onFinish={loginMutation.mutate}
        disabled={loginMutation.isLoading}
      >
        <div className="text-2xl">
          Welcome back to <span className="text-primary font-bold">Watchverse</span>
        </div>
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
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <div className="flex items-center justify-center">
          <Button type="primary" htmlType="submit" loading={loginMutation.isLoading} disabled={loginMutation.isLoading}>
            Login
          </Button>
        </div>

        <div className="text-center">
          Do not have an account?{' '}
          <Link to="/signup" className="text-primary hover:text-primary/70">
            Signup Now
          </Link>
        </div>
      </Form>
    </div>
  )
}
