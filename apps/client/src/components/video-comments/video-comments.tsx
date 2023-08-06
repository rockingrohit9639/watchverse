import clsx from 'clsx'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Avatar, Form, Input, Result } from 'antd'
import { createComment, findVideoComments } from '~/queries/comment'
import { QUERY_KEYS } from '~/utils/qk'
import Loading from '../loading'
import { getErrorMessage } from '~/utils/error'
import Comment from './components/comment'
import { useUser } from '~/hooks/use-user'
import { ENV } from '~/utils/env'
import { Comment as CommentType, CreateCommentDto } from '~/types/comment'
import useError from '~/hooks/use-error'

type VideoCommentsProps = {
  className?: string
  style?: React.CSSProperties
  videoId: string
}

export default function VideoComments({ className, style, videoId }: VideoCommentsProps) {
  const { user } = useUser()
  const {
    data: comments,
    isLoading,
    error,
  } = useQuery([QUERY_KEYS.comments, videoId], () => findVideoComments(videoId))
  const { handleError } = useError()
  const queryClient = useQueryClient()
  const [form] = Form.useForm()

  const createCommentMutation = useMutation((dto: CreateCommentDto) => createComment(videoId, dto), {
    onError: handleError,
    onSuccess: (comment) => {
      form.resetFields()
      queryClient.setQueryData<CommentType[]>([QUERY_KEYS.comments, videoId], (prevData) => {
        if (!prevData) return []

        return [comment, ...prevData]
      })
    },
  })

  if (isLoading) {
    return <Loading>Loading Comments...</Loading>
  }

  if (error) {
    return <Result status="error" title="Something went wrong" subTitle={getErrorMessage(error)} />
  }

  return (
    <div className={clsx(className, 'space-y-4')} style={style}>
      <div>{comments?.length} Comments</div>

      <Form
        form={form}
        className="flex items-center gap-2"
        onFinish={createCommentMutation.mutate}
        disabled={createCommentMutation.isLoading}
      >
        <Avatar className="uppercase" src={`${ENV.VITE_API_BASE_URL}/file/download/${user.pictureId}`}>
          {user.name[0]}
        </Avatar>

        <Form.Item name="content" rules={[{ required: true, message: 'Comment is required!' }]} noStyle>
          <Input placeholder="What do you think about this video?" disabled={createCommentMutation.isLoading} />
        </Form.Item>
      </Form>

      {comments?.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  )
}
