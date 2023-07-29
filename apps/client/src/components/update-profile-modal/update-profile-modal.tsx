import { Form, Input, Modal, ModalProps, message } from 'antd'
import { cloneElement, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import useError from '~/hooks/use-error'
import { useUser } from '~/hooks/use-user'
import { updateProfile } from '~/queries/user'
import { UpdateProfileDto } from '~/types/user'
import { QUERY_KEYS } from '~/utils/qk'
import FileUploader from '../file-uploader'

type UpdateProfileModalProps = Omit<ModalProps, 'title' | 'open' | 'onCancel' | 'onOk'> & {
  trigger: React.ReactElement<{ onClick: () => void }>
}

export default function UpdateProfileModal({ trigger, ...props }: UpdateProfileModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { user } = useUser()
  const { handleError } = useError()
  const queryClient = useQueryClient()
  const [form] = Form.useForm()

  const updateProfileMutation = useMutation((dto: UpdateProfileDto) => updateProfile(user.id, dto), {
    onError: handleError,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData([QUERY_KEYS['logged-in']], updatedUser)
      message.success('Profile updated successfully!')
      setIsModalOpen(false)
    },
  })

  return (
    <>
      {cloneElement(trigger, {
        onClick: () => {
          setIsModalOpen(true)
        },
      })}
      <Modal
        title="Update Profile"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
        }}
        onOk={form.submit}
        okText="Update"
        okButtonProps={{ ...props.okButtonProps, loading: updateProfileMutation.isLoading }}
        destroyOnClose
        {...props}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={updateProfileMutation.mutate}
          disabled={updateProfileMutation.isLoading}
          initialValues={{
            name: user.name,
            picture: user.pictureId,
          }}
        >
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Name is required!' }]}>
            <Input placeholder="Input your name" />
          </Form.Item>

          <Form.Item name="picture" label="Profile Picture">
            <FileUploader maxCount={1} accept="image/png, image/jpeg" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
