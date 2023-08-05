import { Form, Select } from 'antd'
import { useQuery } from 'react-query'
import EntityMutationModal from '../entity-mutation-modal'
import { addToPlaylist } from '~/queries/video'
import { QUERY_KEYS } from '~/utils/qk'
import { findActiveChannelPlaylists } from '~/queries/playlist'

type AddToPlaylistProps = {
  className?: string
  style?: React.CSSProperties
  videoId: string
  trigger: React.ReactElement<{ onClick: () => void }>
}

export default function AddToPlaylist({ className, style, videoId, trigger }: AddToPlaylistProps) {
  const { data } = useQuery(QUERY_KEYS['active-channel-playlists'], findActiveChannelPlaylists)

  return (
    <EntityMutationModal
      className={className}
      style={style}
      trigger={trigger}
      mutationFn={({ playlist }) => addToPlaylist(videoId, playlist)}
      onSuccess={(_, queryClient) => {
        queryClient.invalidateQueries([QUERY_KEYS['channel-playlists']])
      }}
    >
      <Form.Item name="playlist" label="Playlist" rules={[{ required: true, message: 'Playlist is required!' }]}>
        <Select
          placeholder="Select playlist"
          options={data?.map((playlist) => ({ value: playlist.id, label: playlist.title }))}
        />
      </Form.Item>
    </EntityMutationModal>
  )
}
