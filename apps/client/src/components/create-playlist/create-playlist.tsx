import { Form, Input, Select, message } from 'antd'
import EntityMutationModal from '../entity-mutation-modal'
import { Visibility } from '~/types/video'
import { createPlaylist } from '~/queries/playlist'
import FileUploader from '../file-uploader'
import { ALLOWED_IMAGE_MIMETYPES } from '~/utils/file'
import { QUERY_KEYS } from '~/utils/qk'
import { Playlist } from '~/types/playlist'

type CreatePlaylistProps = {
  className?: string
  style?: React.CSSProperties
  trigger: React.ReactElement<{ onClick: () => void }>
}

export default function CreatePlaylist({ className, style, trigger }: CreatePlaylistProps) {
  return (
    <EntityMutationModal
      className={className}
      style={style}
      title="Create Playlist"
      okText="Create"
      trigger={trigger}
      initialValues={{ visibility: Visibility.PRIVATE }}
      mutationFn={createPlaylist}
      onSuccess={(createdPlaylist: Playlist, queryClient) => {
        queryClient.setQueryData<Playlist[]>(QUERY_KEYS.playlists, (prev) => {
          if (!prev) return []

          return [...prev, createdPlaylist]
        })
        message.success('Playlist created successfully!')
      }}
    >
      <div className="mb-4">
        This playlist will be created for your current active channel. Make sure you have the right channel active.
      </div>
      <Form.Item
        name="title"
        label="Title"
        rules={[
          { required: true, message: 'Title is required!' },
          { min: 4, message: 'Please enter at least 4 characters' },
          { max: 250, message: 'Please enter note more than 250 characters.' },
        ]}
      >
        <Input placeholder="Title of the playlist" />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[
          { min: 20, message: 'Please enter at least 20 characters' },
          { max: 1000, message: 'Please enter note more than 1000 characters.' },
        ]}
      >
        <Input.TextArea placeholder="Describe about your playlist" rows={6} />
      </Form.Item>

      <Form.Item name="visibility" label="Visibility">
        <Select
          placeholder="Select visibility"
          options={Object.keys(Visibility).map((key) => ({ label: key, value: key }))}
        />
      </Form.Item>

      <Form.Item name="thumbnail" label="Thumbnail" rules={[{ required: true, message: 'Thumbnail is required!' }]}>
        <FileUploader
          showCrop
          uploaderProps={{ maxCount: 1, accept: ALLOWED_IMAGE_MIMETYPES }}
          cropperProps={{ aspect: 16 / 9 }}
        />
      </Form.Item>
    </EntityMutationModal>
  )
}
