import React from 'react'
import { useNetwork } from 'wagmi'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { useFormik } from 'formik'
import { fetchRelayData, deleteRelayData } from './relaySlice'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'

import ChainIdHandler from '../../components/ChainIdHandler'
import LoadingButton from '../../components/LoadingButton'

import RelayCommands from '../RelayCommands/Commands'

import { PingResponse } from '@opengsn/common'

function Relay () {
  const relay = useAppSelector((state) => state.relay)
  const relayData: PingResponse = relay.relay
  const chainId = Number(relayData.chainId)

  const dispatch = useAppDispatch()

  const { chain } = useNetwork()

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
        {/* TODO: extract a RelayData component */}
        <details>
          <summary>Show relay data: <span>{relayData.ownerAddress}</span></summary>
          {
            Object.keys(relayData).map((x, i) => {
              return <div key={i}>{x}: {(relayData[x as keyof PingResponse])?.toString()}</div>
            })
          }
        </details>
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
