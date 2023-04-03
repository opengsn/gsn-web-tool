import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Typography, Icon, VariantType } from '../../../components/atoms'
import { ROUTES } from '../../../constants/routes'
import { colors } from '../../../theme'

const RegisterNewButton = () => {
  return (
    <Link to={ROUTES.RegisterNew} style={{ textDecoration: 'none' }}>
      <Button.Contained color={colors.white} backgroundColor={colors.green}>
        <Icon.PlusCircleFill />
        &nbsp; &nbsp;<Typography variant={VariantType.H5}>Register New Relay</Typography>
      </Button.Contained>
    </Link>
  )
}

export default React.memo(RegisterNewButton)
