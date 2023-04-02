import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Typography, Icon } from '../../../components/atoms'
import { ROUTES } from '../../../constants/routes'

const RegisterNewButton = () => {
  return (
    <Link to={ROUTES.RegisterNew} style={{ textDecoration: 'none' }}>
      <Button.Contained>
        <Icon.PlusCircleFill />
        &nbsp; &nbsp;<Typography.Body5>Register New Relay</Typography.Body5>
      </Button.Contained>
    </Link>
  )
}

export default React.memo(RegisterNewButton)
