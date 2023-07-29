import { UploadOutlined } from '@ant-design/icons'
import { Upload, UploadProps } from 'antd'
import { apiClient } from '~/utils/client'

type FileUploaderProps = Omit<UploadProps, 'customRequest' | 'listType'> & {
  /** Form.Item internally passes onChange */
  onChange?: (file: string | string[]) => void
  mode?: 'multiple' | 'single'
}

export default function FileUploader({ mode = 'single', onChange, ...props }: FileUploaderProps) {
  return (
    <Upload
      listType="picture-card"
      {...props}
      customRequest={async ({ onError, onProgress, onSuccess, file, filename }) => {
        const formData = new FormData()
        formData.append('file', file as Blob, filename)

        try {
          const { data } = await apiClient.post('file/upload', formData, {
            headers: { 'content-type': 'multipart/form-data' },
            onUploadProgress: onProgress,
          })
          onSuccess?.(data)
        } catch (error) {
          onError?.(error as Error)
        }
      }}
      onChange={(data) => {
        const filesUploaded = data.fileList.map((file) => file.response?.id)
        if (mode === 'multiple') {
          onChange?.(filesUploaded)
        } else {
          onChange?.(filesUploaded[0])
        }
      }}
    >
      <div className="px-2 flex items-center gap-2">
        <UploadOutlined />
        <div>Upload</div>
      </div>
    </Upload>
  )
}
