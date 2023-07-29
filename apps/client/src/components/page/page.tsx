import clsx from 'clsx'

type PageProps = {
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}

export default function Page({ className, style, children }: PageProps) {
  return (
    <div className={clsx(className, 'p-4')} style={style}>
      {children}
    </div>
  )
}
