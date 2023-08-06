import clsx from 'clsx'
import { useRef } from 'react'
import ReactPlayer from 'react-player'

type VideoPlayerProps = {
  className?: string
  style?: React.CSSProperties
  url: string
}

export default function VideoPlayer({ className, style, url }: VideoPlayerProps) {
  const playerRef = useRef<ReactPlayer | null>(null)

  return (
    <div className={clsx('w-full h-full flex-center flex-col', className)} style={style}>
      <ReactPlayer
        controls
        ref={playerRef}
        width="100%"
        height="100%"
        url={url}
        volume={1}
        playIcon={<></>}
        loop={true}
      />
    </div>
  )
}
