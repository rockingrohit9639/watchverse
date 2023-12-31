import { UploadOutlined } from '@ant-design/icons'
import { Button, Form, Input, Select, message } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import FileUploader from '~/components/file-uploader'
import Page from '~/components/page'
import TagSelector from '~/components/tag-selector'
import useError from '~/hooks/use-error'
import { uploadVideo } from '~/queries/video'
import { Visibility } from '~/types/video'
import { ALLOWED_IMAGE_MIMETYPES, ALLOWED_VIDEO_MIMETYPES } from '~/utils/file'

export default function UploadVideo() {
  const { handleError } = useError()
  const navigate = useNavigate()

  const uploadVideoMutation = useMutation(uploadVideo, {
    onError: handleError,
    onSuccess: () => {
      message.success('Video uploaded successfully!')
      navigate('/')
    },
  })

  return (
    <Page>
      <Form
        layout="vertical"
        className="grid grid-cols-4 gap-4"
        initialValues={{
          visibility: Visibility.PRIVATE,
        }}
        onFinish={uploadVideoMutation.mutate}
        disabled={uploadVideoMutation.isLoading}
      >
        <div className="col-span-3">
          <Form.Item
            name="title"
            label="Title"
            rules={[
              { required: true, message: 'Title is required!' },
              { min: 10, message: 'Please enter at least 10 characters!' },
              { max: 250, message: 'Please enter at most 250 characters.' },
            ]}
          >
            <Input placeholder="Add a title that describes your video" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: 'Description' },
              { min: 30, message: 'Please enter at least 30 characters!' },
              { max: 2000, message: 'Please enter at most 2000 characters.' },
            ]}
          >
            <Input.TextArea placeholder="Tell viewers about your video" rows={20} />
          </Form.Item>

          <Form.Item name="video" label="Video" rules={[{ required: true, message: 'Video is required!' }]}>
            <FileUploader uploaderProps={{ maxCount: 1, accept: ALLOWED_VIDEO_MIMETYPES }} />
          </Form.Item>
        </div>
        <div className="col-span-1">
          <Form.Item
            name="visibility"
            label="Visibility"
            rules={[{ required: true, message: 'Visibility is required!' }]}
          >
            <Select
              placeholder="Video visibility"
              options={Object.keys(Visibility).map((key) => ({ value: key, label: key }))}
            />
          </Form.Item>

          <Form.Item name="tags" label="Tags" rules={[{ required: true, message: 'Tags are required!' }]}>
            <TagSelector placeholder="Select tags for you video" mode="multiple" />
          </Form.Item>

          <Form.Item name="thumbnail" label="Thumbnail" rules={[{ required: true, message: 'Thumbnail is required!' }]}>
            <FileUploader
              showCrop
              uploaderProps={{ maxCount: 1, accept: ALLOWED_IMAGE_MIMETYPES }}
              cropperProps={{ aspect: 16 / 9 }}
            />
          </Form.Item>
        </div>

        <Button
          type="primary"
          icon={<UploadOutlined />}
          htmlType="submit"
          disabled={uploadVideoMutation.isLoading}
          loading={uploadVideoMutation.isLoading}
        >
          Upload
        </Button>
      </Form>
    </Page>
  )
}
