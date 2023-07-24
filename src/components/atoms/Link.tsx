import React, { FC, ReactNode } from 'react'

interface IProps {
  href: string
  children: ReactNode
  textDecorationColor?: string
}

const Link: FC<IProps> = ({ href, children, textDecorationColor }) => {
  return (
    <a
      href={href}
      style={{
        textDecorationColor
      }}
      target='_blank'
      rel='noreferrer'
    >
      {children}
    </a>
  )
}

export default Link
