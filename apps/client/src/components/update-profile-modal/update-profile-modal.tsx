import { Form, Input, message } from 'antd'
import { useUser } from '~/hooks/use-user'
import { updateProfile } from '~/queries/user'
import { UpdateProfileDto } from '~/types/user'
import { QUERY_KEYS } from '~/utils/qk'
import FileUploader from '../file-uploader'
import EntityMutationModal from '../entity-mutation-modal'
import { ALLOWED_IMAGE_MIMETYPES } from '~/utils/file'

type UpdateProfileModalProps = {
  trigger: React.ReactElement<{ onClick: () => void }>
}

export default function UpdateProfileModal({ trigger }: UpdateProfileModalProps) {
  const { user } = useUser()

  return (
    <EntityMutationModal
      title="Update Profile"
      okText="Update"
      mutationFn={(dto: UpdateProfileDto) => updateProfile(user.id, dto)}
      trigger={trigger}
      initialValues={{ name: user.name }}
      onSuccess={(updatedUser, queryClient) => {
        queryClient.setQueryData(QUERY_KEYS['logged-in'], updatedUser)
        message.success('Profile updated successfully!')
      }}
    >
      <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Name is required!' }]}>
        <Input placeholder="Input your name" />
      </Form.Item>

      <Form.Item name="picture" label="Profile Picture">
        <FileUploader maxCount={1} accept={ALLOWED_IMAGE_MIMETYPES} />
      </Form.Item>
    </EntityMutationModal>
  )
}
