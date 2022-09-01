
export interface RelayUrlProps {
  url: string
}

export default function RelayUrl ({ url }: RelayUrlProps) {
  const withoutGetaddr = (url: string) => url.replace(/\/getaddr/, '')
  return (
    <>
      <a href={url} rel="noreferrer" target="_blank">{withoutGetaddr(url)}</a>
    </>
  )
}
