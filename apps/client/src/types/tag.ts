export type Tag = {
  id: string
  tag: string
  createdAt: Date
  updatedAt: Date
}

export type CreateTagDto = Pick<Tag, 'tag'>
