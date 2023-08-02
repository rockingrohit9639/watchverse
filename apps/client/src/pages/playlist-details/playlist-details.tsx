import { Result } from 'antd'
import moment from 'moment'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import Loading from '~/components/loading'
import Page from '~/components/page'
import Video from '~/components/video'
import { findPlaylist } from '~/queries/playlist'
import { DATE_FORMAT } from '~/utils/constants'
import { ENV } from '~/utils/env'
import { getErrorMessage } from '~/utils/error'
import { QUERY_KEYS } from '~/utils/qk'

export default function PlaylistDetails() {
  const { id } = useParams() as { id: string }
  const { data: playlist, isLoading, error } = useQuery([QUERY_KEYS['playlist-details'], id], () => findPlaylist(id))

  if (isLoading) {
    return <Loading>Loading playlist details</Loading>
  }

  if (error) {
    return (
      <div className="w-full h-full flex-center">
        <Result status="error" title="Something went wrong" subTitle={getErrorMessage(error)} />
      </div>
    )
  }

  if (!playlist) {
    return null
  }

  return (
    <Page className="grid grid-cols-3 gap-4">
      <div className="space-y-2 border border-gray-50/10 rounded-lg p-4 bg-gray-500/10">
        <div className="font-bold">{playlist.title}</div>
        <img
          src={`${ENV.VITE_API_BASE_URL}/file/download/${playlist.thumbnailId}`}
          alt="thumbnail"
          className="aspect-video object-cover rounded-lg"
        />
        <div>{playlist.description}</div>
        <div>{playlist.channel.name}</div>
        <div className="flex items-center gap-2 text-gray-500">
          <div className="text-sm">{playlist.videoIds.length} videos</div>
          <div className="text-sm">{playlist.videos.reduce((acc, curr) => (acc += curr.views), 0)} views</div>
          <div className="text-sm">Updated on {moment(playlist.updatedAt).format(DATE_FORMAT)}</div>
        </div>
      </div>
      <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2">
        {playlist.videos.map((video) => (
          <Video key={video.id} video={video} />
        ))}
      </div>
    </Page>
  )
}
