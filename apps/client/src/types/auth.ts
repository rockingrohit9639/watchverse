export type LoginDto = {
  email: string
  password: string
}

export type SignupDto = LoginDto & {
  name: string
}
