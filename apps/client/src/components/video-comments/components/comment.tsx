import { Avatar } from 'antd'
import clsx from 'clsx'
import moment from 'moment'
import { Comment as CommentType } from '~/types/comment'
import { ENV } from '~/utils/env'

type CommentProps = {
  className?: string
  style?: React.CSSProperties
  comment: CommentType
}

export default function Comment({ className, style, comment }: CommentProps) {
  return (
    <div className={clsx('flex gap-2', className)} style={style}>
      <Avatar className="uppercase" src={`${ENV.VITE_API_BASE_URL}/file/download/${comment.createdBy.pictureId}`}>
        {comment.createdBy.name[0]}
      </Avatar>

      <div>
        <div className="flex items-center text-sm gap-2">
          <div>{comment.createdBy.name}</div>
          <div className="text-text-secondary">{moment(comment.createdAt).fromNow()}</div>
        </div>
        <div>{comment.content}</div>
      </div>
    </div>
  )
}
