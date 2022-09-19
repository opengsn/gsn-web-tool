import React from 'react'
import RelayUrlForm from '../feature/Relay/RelayUrlForm'
import Row from 'react-bootstrap/Row'

function RegisterNewRelay () {
  return <div>
    <Row>
      <RelayUrlForm />
    </Row>
  </div>
}

export default React.memo(RegisterNewRelay)
