import { LikeFilled, LikeOutlined } from '@ant-design/icons'
import clsx from 'clsx'
import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import useError from '~/hooks/use-error'
import { useUser } from '~/hooks/use-user'
import { getLikeDocumentForVideo, likeOrUnlike } from '~/queries/like'
import { Like } from '~/types/like'
import { Video } from '~/types/video'
import { QUERY_KEYS } from '~/utils/qk'

type LikeVideoProps = {
  className?: string
  style?: React.CSSProperties
  video: Video
}

export default function LikeVideo({ className, style, video }: LikeVideoProps) {
  const { data } = useQuery([QUERY_KEYS.like, video.id], () => getLikeDocumentForVideo(video.id))
  const { user } = useUser()
  const { handleError } = useError()
  const queryClient = useQueryClient()

  const isLiked = useMemo(() => {
    if (!data) return false

    return data.likedByIds.includes(user.id)
  }, [data, user.id])

  const likeOrUnlikeMutation = useMutation(likeOrUnlike, {
    onError: handleError,
    onSuccess: () => {
      queryClient.setQueryData<Video>([QUERY_KEYS.video, video.id], (prevData) => {
        if (!prevData) return {} as Video
        return { ...prevData, likes: isLiked ? prevData.likes - 1 : prevData.likes + 1 }
      })
      queryClient.setQueryData<Like>([QUERY_KEYS.like, video.id], (prevData) => {
        if (!prevData) return {} as Like

        if (isLiked) {
          return { ...prevData, likedByIds: prevData.likedByIds.filter((likeBy) => likeBy !== user.id) }
        } else {
          return { ...prevData, likedByIds: [...prevData.likedByIds, user.id] }
        }
      })
    },
  })

  return (
    <div
      className={clsx('bg-gray-500/10 px-4 py-2 gap-2 rounded-full flex-center cursor-pointer', className)}
      style={style}
      onClick={() => likeOrUnlikeMutation.mutate(video.id)}
    >
      {isLiked ? <LikeFilled /> : <LikeOutlined />}
      <div className="text-sm">{video.likes} Likes</div>
    </div>
  )
}
