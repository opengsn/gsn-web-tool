import { useState } from 'react'
import { Button } from '../../../../components/atoms'
import Collapse from '../../../../components/atoms/Collapse'

export default function DeregisterRelay() {
  const [showDeregisterRelay, setShowDeregisterRelay] = useState(false)

  const handleShowDeregisterRelay = () => {
    setShowDeregisterRelay(!showDeregisterRelay)
  }

  return (
    <>
      <Button.Contained onClick={handleShowDeregisterRelay} aria-controls='register-relay-form' aria-expanded={showDeregisterRelay}>
        Deregister
      </Button.Contained>
      <Collapse in={showDeregisterRelay}>
        <div className='border p-3' id='register-relay-form'>
          <div>WIP</div>
        </div>
      </Collapse>
    </>
  )
}
