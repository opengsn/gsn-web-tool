import { Typography } from '../../../../components/atoms'

export interface RelayUrlProps {
  url: string
}

export default function RelayUrl({ url }: RelayUrlProps) {
  const withoutGetaddr = (url: string) => url.replace(/\/getaddr/, '')
  return (
    <a href={url} rel='noreferrer' target='_blank'>
      <Typography variant='body2'>{withoutGetaddr(url)}</Typography>
    </a>
  )
}
