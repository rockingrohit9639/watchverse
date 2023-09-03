import { Result } from 'antd'
import { range } from 'lodash'
import { useQuery } from '@tanstack/react-query'
import Page from '~/components/page'
import Video from '~/components/video'
import { fetchFeed } from '~/queries/video'
import { getErrorMessage } from '~/utils/error'
import { QUERY_KEYS } from '~/utils/qk'

export default function Home() {
  const { data: videos, isLoading, error } = useQuery([QUERY_KEYS.feed], fetchFeed)

  if (isLoading) {
    return (
      <Page className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {range(6).map((i) => (
          <div key={i} className="border border-gray-500/10 h-80 rounded-lg animate-pulse bg-gray-500/10" />
        ))}
      </Page>
    )
  }

  if (error) {
    return <Result status="error" title="Something went wrong!" subTitle={getErrorMessage(error)} />
  }

  if (!videos) {
    return null
  }

  return (
    <Page className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {videos.map((video) => (
        <Video key={video.id} video={video} />
      ))}
    </Page>
  )
}
