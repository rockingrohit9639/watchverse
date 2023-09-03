import { PlusOutlined } from '@ant-design/icons'
import { Button, Divider, Form, Input, Select, SelectProps } from 'antd'
import clsx from 'clsx'
import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import useError from '~/hooks/use-error'
import { createTag, findTags } from '~/queries/tag'
import { Tag } from '~/types/tag'
import { QUERY_KEYS } from '~/utils/qk'

type TagSelectorProps = Omit<SelectProps, 'dropdownRender' | 'options'>

export default function TagSelector({ ...props }: TagSelectorProps) {
  const { data } = useQuery([QUERY_KEYS.tags], findTags)
  const { handleError } = useError()
  const queryClient = useQueryClient()
  const [form] = Form.useForm()

  const createTagMutation = useMutation(createTag, {
    onError: handleError,
    onSuccess: (createdTag) => {
      form.resetFields()
      queryClient.setQueryData<Tag[]>([QUERY_KEYS.tags], (prevTags) => {
        if (!prevTags) return []

        return [createdTag, ...prevTags]
      })
    },
  })

  const options = useMemo(() => data?.map((item) => ({ label: item.tag, value: item.id })), [data])

  return (
    <Select
      {...props}
      className={clsx('w-96', props.className)}
      options={options}
      dropdownRender={(menu) => (
        <>
          {menu}
          <Divider style={{ margin: '8px 0' }} />
          <Form
            form={form}
            className="space-y-2"
            onFinish={createTagMutation.mutate}
            disabled={createTagMutation.isLoading}
          >
            <Form.Item name="tag" rules={[{ required: true, message: 'Tag is required!' }]} noStyle>
              <Input placeholder="Enter tag" />
            </Form.Item>
            <Button
              htmlType="submit"
              block
              icon={<PlusOutlined />}
              disabled={createTagMutation.isLoading}
              loading={createTagMutation.isLoading}
            >
              Add Tag
            </Button>
          </Form>
        </>
      )}
    />
  )
}
