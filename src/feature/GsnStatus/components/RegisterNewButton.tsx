import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Typography, Icon } from '../../../components/atoms'
import { ROUTES } from '../../../constants/routes'

const RegisterNewButton = () => {
  return (
    <Link to={ROUTES.RegisterNew} style={{ textDecoration: 'none' }}>
      <Button.Contained size='large'>
        <Icon.PlusCircleFill />
        &nbsp; &nbsp;<Typography variant={'body1'}>Register New Relay</Typography>
      </Button.Contained>
    </Link>
  )
}

export default React.memo(RegisterNewButton)
