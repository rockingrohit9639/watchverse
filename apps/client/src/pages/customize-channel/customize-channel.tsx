import { RedoOutlined } from '@ant-design/icons'
import { Button, Empty, Form, Input, Result, message } from 'antd'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import FileUploader from '~/components/file-uploader'
import Loading from '~/components/loading'
import Page from '~/components/page'
import useError from '~/hooks/use-error'
import { fetchChannelDetails, updateChannel } from '~/queries/channel'
import { UpdateChannelDto } from '~/types/channel'
import { getErrorMessage } from '~/utils/error'
import { ALLOWED_IMAGE_MIMETYPES } from '~/utils/file'
import { QUERY_KEYS } from '~/utils/qk'

export default function CustomizeChannel() {
  const { id } = useParams() as { id: string }
  const { data, isLoading, error } = useQuery([QUERY_KEYS.channel], () => fetchChannelDetails(id))
  const { handleError } = useError()
  const queryClient = useQueryClient()

  const updateChannelMutation = useMutation((dto: UpdateChannelDto) => updateChannel(id, dto), {
    onError: handleError,
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.channels])
      message.success('Channel Updated Successfully!')
    },
  })

  if (isLoading) {
    return <Loading>Fetching Channel Details...</Loading>
  }

  if (error) {
    return <Result status="error" title="Something went wrong" subTitle={getErrorMessage(error)} />
  }

  if (!data) {
    return <Empty description="Channel not found" />
  }

  return (
    <Page>
      <Form
        layout="vertical"
        initialValues={{
          name: data.name,
          description: data.description,
        }}
        disabled={updateChannelMutation.isLoading}
        onFinish={updateChannelMutation.mutate}
      >
        <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Channel name is required!' }]}>
          <Input placeholder="Name of your channel" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Channel description is required!' }]}
        >
          <Input.TextArea placeholder="Describe in brief about your channel." rows={6} />
        </Form.Item>

        <div className="flex items-center gap-6">
          <Form.Item name="logo" label="Logo">
            <FileUploader showCrop uploaderProps={{ maxCount: 1, accept: ALLOWED_IMAGE_MIMETYPES }} />
          </Form.Item>

          <Form.Item name="banner" label="Banner">
            <FileUploader
              showCrop
              uploaderProps={{ maxCount: 1, accept: ALLOWED_IMAGE_MIMETYPES }}
              cropperProps={{ aspect: 16 / 9 }}
            />
          </Form.Item>
        </div>

        <Button
          type="primary"
          htmlType="submit"
          icon={<RedoOutlined />}
          loading={updateChannelMutation.isLoading}
          disabled={updateChannelMutation.isLoading}
        >
          Update
        </Button>
      </Form>
    </Page>
  )
}
