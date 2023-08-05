import { Form, Input } from 'antd'
import EntityMutationModal from '../entity-mutation-modal'
import FileUploader from '../file-uploader/file-uploader'
import { ALLOWED_IMAGE_MIMETYPES } from '~/utils/file'
import { createChannel } from '~/queries/channel'
import { Channel } from '~/types/channel'
import { QUERY_KEYS } from '~/utils/qk'

type CreateChannelModalProps = {
  trigger: React.ReactElement<{ onClick: () => void }>
}

export default function CreateChannelModal({ trigger }: CreateChannelModalProps) {
  return (
    <EntityMutationModal
      title="Create Channel"
      okText="Create"
      trigger={trigger}
      mutationFn={createChannel}
      onSuccess={(data: Channel, queryClient) => {
        queryClient.setQueriesData<Channel[]>(QUERY_KEYS.channels, (prev) => {
          if (!prev) return []
          return [...prev, data]
        })
      }}
    >
      <Form.Item
        name="name"
        label="Name"
        rules={[
          { required: true, message: 'Channel name is required!' },
          { min: 4, message: 'Please enter at least 4 characters!' },
          { max: 50, message: 'Please enter at most 50 characters!' },
        ]}
      >
        <Input placeholder="Enter channel name" />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[
          { required: true, message: 'Channel Description is required!' },
          { min: 20, message: 'Please enter at least 20 characters!' },
          { max: 2000, message: 'Please enter at most 2000 characters!' },
        ]}
      >
        <Input.TextArea placeholder="Enter channel description" />
      </Form.Item>

      <div className="flex items-center gap-4">
        <Form.Item name="logo" label="Logo" rules={[{ required: true, message: 'Channel logo is required!' }]}>
          <FileUploader maxCount={1} accept={ALLOWED_IMAGE_MIMETYPES} />
        </Form.Item>

        <Form.Item name="banner" label="Banner">
          <FileUploader maxCount={1} accept={ALLOWED_IMAGE_MIMETYPES} />
        </Form.Item>
      </div>
    </EntityMutationModal>
  )
}
