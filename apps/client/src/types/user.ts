export type User = {
  id: string
  name: string
  email: string
  pictureId: string
  createdAt: string
  updatedAt: string
}

export type UpdateProfileDto = Pick<User, 'name'> & {
  picture?: string
}
