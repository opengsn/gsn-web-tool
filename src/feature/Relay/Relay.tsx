import React from 'react'
import { useNetwork } from 'wagmi'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { useFormik } from 'formik'
import { fetchRelayData, deleteRelayData } from './relaySlice'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'

import RelayCommands from '../RelayCommands/Commands'

import { PingResponse } from '@opengsn/common'
import LoadingButton from '../../components/LoadingButton'

function Relay() {
  const relay = useAppSelector((state) => state.relay)
  const dispatch = useAppDispatch()
  const chainId = Number(relay.relay.chainId)

  const {
    activeChain,
    error,
    isLoading,
    switchNetwork
  } = useNetwork()

  const getRelayForm = useFormik({
    initialValues: {
      url: ''
    },
    onSubmit: values => {
      dispatch(fetchRelayData(values.url)).catch(console.error)
    }
  })

  const ChainIdHandler = () => {
    console.log(chainId, activeChain, error)
    return (
      <Alert variant='warning'>
        <Alert.Heading>Wrong chain</Alert.Heading>
        <p>Wallet is connected to ID #{activeChain?.id} while the relay is on #{chainId}</p>
        {isLoading ? <LoadingButton /> : null}
        {error !== null
          ? <Alert variant='danger'>Chain ID check failed: {error?.message}</Alert>
          : null}
        {switchNetwork !== undefined && !isLoading
          ? <Button variant='primary' onClick={() => switchNetwork(chainId)}>Switch network</Button>
          : null}
      </Alert>
    )
  }

  return (
    <div className="row">
      {relay.errorMsg !== '' ? relay.errorMsg : null}
      {relay.relay.version !== undefined
        ? <>
          {/* TODO: extract a RelayData component */}
          <details>
            <summary>Show relay data: <span>{relay.relay.ownerAddress}</span></summary>
            {
              Object.keys(relay.relay).map((x, i) => {
                return <div key={i}>{x}: {(relay.relay[x as keyof PingResponse])?.toString()}</div>
              })
            }
          </details>
          {activeChain?.id !== chainId && switchNetwork !== undefined
            ? <ChainIdHandler />
            : <RelayCommands />
          }
          <Button variant="secondary"
            className="my-2"
            onClick={() => dispatch(deleteRelayData())}
          >Switch</Button>
        </>
        : <Form onSubmit={getRelayForm.handleSubmit}>
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
      }
    </div>
  )
}
export default React.memo(Relay)
