import { Form, Input, Select } from 'antd'
import { useQuery } from 'react-query'
import EntityMutationModal from '../entity-mutation-modal'
import { findVideoDetails, updateVideo } from '~/queries/video'
import { QUERY_KEYS } from '~/utils/qk'
import { Video, Visibility } from '~/types/video'
import FileUploader from '../file-uploader'
import { ALLOWED_IMAGE_MIMETYPES } from '~/utils/file'

type UpdateVideoModalProps = {
  className?: string
  style?: React.CSSProperties
  trigger: React.ReactElement<{ onClick: () => void }>
  videoId: string
}

export default function UpdateVideoModal({ className, style, trigger, videoId }: UpdateVideoModalProps) {
  const { data } = useQuery(QUERY_KEYS.video, () => findVideoDetails(videoId))

  return (
    <EntityMutationModal
      className={className}
      style={style}
      mutationFn={(dto) => updateVideo(videoId, dto)}
      trigger={trigger}
      initialValues={{
        title: data?.title,
        description: data?.description,
        visibility: data?.visibility,
      }}
      onSuccess={(updatedVideo: Video, queryClient) => {
        queryClient.setQueryData<Video[]>(QUERY_KEYS['active-channel-videos'], (prev) => {
          if (!prev) return []

          return prev.map((video) => {
            if (video.id === updatedVideo.id) {
              return updatedVideo
            }
            return video
          })
        })
      }}
    >
      <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Title is required!' }]}>
        <Input placeholder="Title of your video" />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: 'Description is required!' }]}
      >
        <Input.TextArea placeholder="Description of your video" rows={5} />
      </Form.Item>

      <Form.Item name="visibility" label="Visibility" rules={[{ required: true, message: 'Visibility is required!' }]}>
        <Select
          placeholder="Select visibility"
          options={Object.keys(Visibility).map((visibility) => ({ label: visibility, value: visibility }))}
        />
      </Form.Item>

      <Form.Item name="thumbnail" label="Thumbnail">
        <FileUploader maxCount={1} accept={ALLOWED_IMAGE_MIMETYPES} />
      </Form.Item>
    </EntityMutationModal>
  )
}
