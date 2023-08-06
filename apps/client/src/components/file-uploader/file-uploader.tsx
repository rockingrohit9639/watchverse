import { UploadOutlined } from '@ant-design/icons'
import { Upload, UploadProps } from 'antd'
import ImgCrop, { ImgCropProps } from 'antd-img-crop'
import { apiClient } from '~/utils/client'

type UploaderProps = Omit<UploadProps, 'customRequest' | 'listType' | 'onChange'> & {
  onChange?: (file: string | string[]) => void
  mode?: 'multiple' | 'single'
}

function Uploader({ mode = 'single', onChange, ...props }: UploaderProps) {
  return (
    <Upload
      {...props}
      progress={{ format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%` }}
      listType="picture-card"
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

type FileUploaderProps = {
  showCrop?: boolean
  /** Form.Item internally passes onChange */
  onChange?: (file: string | string[]) => void
  uploaderProps?: UploaderProps
  cropperProps?: Omit<ImgCropProps, 'children'>
}

export default function FileUploader({ showCrop = false, onChange, uploaderProps, cropperProps }: FileUploaderProps) {
  return showCrop ? (
    <ImgCrop {...cropperProps}>
      <Uploader onChange={onChange} {...uploaderProps} />
    </ImgCrop>
  ) : (
    <Uploader onChange={onChange} {...uploaderProps} />
  )
}
