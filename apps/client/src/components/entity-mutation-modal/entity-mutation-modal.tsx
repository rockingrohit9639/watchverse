import { Form, Modal, ModalProps } from 'antd'
import { Store } from 'antd/es/form/interface'
import { cloneElement, useState } from 'react'
import { MutationFunction, QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'
import useError from '~/hooks/use-error'

type EntityMutationModalProps<T> = Omit<ModalProps, 'open' | 'onCancel' | 'onOk'> & {
  trigger: React.ReactElement<{ onClick: () => void }>
  children: React.ReactNode
  mutationFn: MutationFunction<any, any>
  onSuccess?: (data: T, queryClient: QueryClient) => void
  initialValues?: Store
}

export default function EntityMutationModal<T extends Record<string, any>>({
  trigger,
  children,
  mutationFn,
  onSuccess,
  initialValues,
  ...props
}: EntityMutationModalProps<T>) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { handleError } = useError()
  const queryClient = useQueryClient()
  const [form] = Form.useForm()

  const mutation = useMutation(mutationFn, {
    onError: handleError,
    onSuccess: (updatedUser: T) => {
      form.resetFields()
      onSuccess?.(updatedUser, queryClient)
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
        title={props.title ?? 'Create'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
        }}
        onOk={form.submit}
        okText={props.okText ?? 'Update'}
        okButtonProps={{ ...props.okButtonProps, loading: mutation.isLoading }}
        destroyOnClose
        {...props}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={mutation.mutate}
          disabled={mutation.isLoading}
          initialValues={initialValues}
        >
          {children}
        </Form>
      </Modal>
    </>
  )
}
