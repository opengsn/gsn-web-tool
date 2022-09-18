import React, { useRef } from 'react'
import { Flip, toast } from 'react-toastify'
import { useFormik } from 'formik'

import { useAppDispatch, useAppSelector } from '../hooks'
import { fetchRelayData } from '../feature/Relay/relaySlice'
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
