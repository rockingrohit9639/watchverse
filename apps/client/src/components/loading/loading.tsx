import { Spin } from 'antd'
import clsx from 'clsx'

type LoadingProps = {
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

export default function Loading({ className, style, children }: LoadingProps) {
  return (
    <div className={clsx('w-full h-screen flex-center', className)} style={style}>
      <Spin>{children}</Spin>
    </div>
  )
}
