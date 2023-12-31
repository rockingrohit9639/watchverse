import { MoreOutlined } from '@ant-design/icons'
import { Divider, Dropdown } from 'antd'
import { useCallback } from 'react'
import { useQueries } from '@tanstack/react-query'
import AddToPlaylist from '~/components/add-to-playlist'
import Loading from '~/components/loading'
import Page from '~/components/page'
import Playlist from '~/components/playlist'
import UpdateVideoModal from '~/components/update-video-modal'
import Video from '~/components/video'
import { findActiveChannelPlaylists } from '~/queries/playlist'
import { findActiveChannelVideos } from '~/queries/video'
import { QUERY_KEYS } from '~/utils/qk'

export default function Library() {
  const [playlistsQuery, videosQuery] = useQueries({
    queries: [
      { queryKey: [QUERY_KEYS['channel-playlists']], queryFn: findActiveChannelPlaylists },
      { queryKey: [QUERY_KEYS['active-channel-videos']], queryFn: findActiveChannelVideos },
    ],
  })

  const videoMoreContent = useCallback((videoId: string) => {
    return (
      <Dropdown
        trigger={['click']}
        menu={{
          items: [
            {
              key: 'update-video',
              label: <UpdateVideoModal trigger={<div>Update Video</div>} videoId={videoId} />,
            },
            {
              key: 'add-to-playlist',
              label: <AddToPlaylist trigger={<div>Add To Playlist</div>} videoId={videoId} />,
            },
          ],
        }}
      >
        <MoreOutlined />
      </Dropdown>
    )
  }, [])

  if (playlistsQuery.isLoading || videosQuery.isLoading) {
    return <Loading>Fetching your library</Loading>
  }

  return (
    <Page className="space-y-4">
      {playlistsQuery.data?.length ? <Divider>Your created playlists</Divider> : null}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {playlistsQuery.data?.map((playlist) => (
          <Playlist key={playlist.id} playlist={playlist} />
        ))}
      </div>

      {videosQuery.data?.length ? <Divider>Videos Uploaded For Active Channel</Divider> : null}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {videosQuery.data?.map((video) => (
          <Video key={video.id} video={video} moreContent={videoMoreContent(video.id)} />
        ))}
      </div>
    </Page>
  )
}
