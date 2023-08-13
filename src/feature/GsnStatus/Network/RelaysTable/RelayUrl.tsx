import { Link, Typography } from '../../../../components/atoms'

export interface RelayUrlProps {
  url: string
}

export default function RelayUrl({ url }: RelayUrlProps) {
  const withoutGetaddr = (url: string) => url.replace(/\/getaddr/, '')
  return (
    <Link href={url}>
      <Typography variant='h6'>{withoutGetaddr(url)}</Typography>
    </Link>
  )
}
