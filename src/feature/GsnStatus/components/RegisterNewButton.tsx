import React from 'react'
import { Button } from 'react-bootstrap'
import { PlusCircleFill } from 'react-bootstrap-icons'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../../constants/routes'

const RegisterNewButton = () => {
  return (
    <Link to={ROUTES.RegisterNew}>
      <Button size='lg' variant='success' className='h-75 w-100'>
        <PlusCircleFill
          size={24}
          style={{
            display: 'inline-block',
            marginBottom: '3px',
            marginRight: '4px'
          }}
        />{' '}
        <span>Register New Relay</span>
      </Button>
    </Link>
  )
}

export default React.memo(RegisterNewButton)
