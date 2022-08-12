import { useState } from 'react'
import Collapse from 'react-bootstrap/Collapse'
import Button from 'react-bootstrap/Button'

export default function DeregisterRelay () {
  const [showDeregisterRelay, setShowDeregisterRelay] = useState(false)

  const handleShowDeregisterRelay = () => {
    setShowDeregisterRelay(!showDeregisterRelay)
  }

  return (
    <>
      <Button
        onClick={handleShowDeregisterRelay}
        aria-controls="register-relay-form"
        aria-expanded={showDeregisterRelay}
        variant="danger"
        className="mt-2"
      >
        Deregister
      </Button>
      <Collapse in={showDeregisterRelay}>
        <div className="border p-3" id="register-relay-form">
          <div>WIP</div>
        </div>
      </Collapse>
    </>
  )
}
