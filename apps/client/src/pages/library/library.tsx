import { Result } from 'antd'
import { useQuery } from 'react-query'
import Loading from '~/components/loading'
import Page from '~/components/page'
import Playlist from '~/components/playlist'
import { findActiveChannelPlaylists } from '~/queries/playlist'
import { getErrorMessage } from '~/utils/error'
import { QUERY_KEYS } from '~/utils/qk'

export default function Library() {
  const { data, isLoading, error } = useQuery([QUERY_KEYS.playlists], findActiveChannelPlaylists)

  if (isLoading) {
    return <Loading>Loading your playlists...</Loading>
  }

  if (error) {
    return <Result status="error" title="Something went wrong" subTitle={getErrorMessage(error)} />
  }

  return (
    <Page>
      <div className="text-2xl font-bold mb-4">Your created playlists</div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {data?.map((playlist) => (
          <Playlist key={playlist.id} playlist={playlist} />
        ))}
      </div>
    </Page>
  )
}
