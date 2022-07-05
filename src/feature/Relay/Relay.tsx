import React from 'react'
import { useNetwork } from 'wagmi'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { useFormik } from 'formik'
import { fetchRelayData, deleteRelayData } from './relaySlice'

import Collapse from 'react-bootstrap/Collapse'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import ChainIdHandler from '../../components/ChainIdHandler'

import RelayInfo from '../RelayInfo/Info'
import RelayCommands from '../RelayCommands/Commands'

import { PingResponse } from '@opengsn/common'

function Relay () {
  const [showInfo, setShowInfo] = React.useState(false)
  const relay = useAppSelector((state) => state.relay)
  const relayData: PingResponse = relay.relay
  const chainId = Number(relayData.chainId)

  const dispatch = useAppDispatch()

  const { chain } = useNetwork()

  // unmount Relay's Info component every time chain changes
  // to avoid exception
  React.useEffect(() => {
    setShowInfo(false)
  }, [chain, setShowInfo])

  const getRelayForm = useFormik({
    initialValues: {
      url: ''
    },
    onSubmit: values => {
      dispatch(fetchRelayData(values.url)).catch(console.error)
    }
  })

  const handleDeleteRelayData = () => {
    dispatch(deleteRelayData()).catch(console.error)
  }

  if (Object.keys(relayData).length === 0) {
    return (
      <Form onSubmit={getRelayForm.handleSubmit}>
        <Form.Label htmlFor="url">Relay URL
          <Form.Control
            id="url"
            name="url"
            type="url"
            onChange={getRelayForm.handleChange}
            value={getRelayForm.values.url}
          />
        </Form.Label>
        <br />
        <Button variant="success" type="submit">Fetch data</Button>
      </Form>
    )
  }
  if (relay.errorMsg !== '') return <span>{relay.errorMsg}</span>
  if (chain?.id !== undefined && chain?.id !== chainId) {
    return <ChainIdHandler relayChainId={chainId} />
  }

  if (chain?.id === chainId && Object.keys(relayData).length > 0) {
    return (
      <div className='row'>
        <>
          <Button
            onClick={() => setShowInfo(!showInfo)}
            aria-controls="relay-info"
            aria-expanded={showInfo}
          >
            Show relay data
          </Button>
          <Collapse in={showInfo}>
            <>
              { showInfo
                ? <div id="relay-info">
                  <RelayInfo />
                </div>
                : null }
            </>
          </Collapse>
        </>
        <RelayCommands />
        <Button variant="secondary"
          className="my-2"
          onClick={handleDeleteRelayData}
        >Switch</Button>
      </div>
    )
  }

  return <>Error initializing relay view</>
}
export default React.memo(Relay)
