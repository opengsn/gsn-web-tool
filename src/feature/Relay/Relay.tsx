import { useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useNetwork } from 'wagmi'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { useFormik } from 'formik'
import { fetchRelayData } from './relaySlice'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import ChainIdHandler from '../../components/ChainIdHandler'
import SwitchRelayButton from './SwitchRelay'

import RelayInfo from '../RelayInfo/Info'
import RelayCommands from '../RelayCommands/Commands'

import { PingResponse } from '@opengsn/common'
import { toast, Flip } from 'react-toastify'

export default function Relay () {
  const dispatch = useAppDispatch()
  const relay = useAppSelector((state) => state.relay)
  const relayData: PingResponse = relay.relay
  const chainId = Number(relayData.chainId)
  const { chain } = useNetwork()
  const abortFetch = useRef<unknown>()

  const getRelayForm = useFormik({
    initialValues: {
      url: ''
    },
    onSubmit: values => {
      const regexpURL = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&/=]*)/i

      const withHttps = (url: string) => `https://${url}`
      const removeTrailingSlashes = (url: string) => url.replace(/\/+$/, '')
      const withGetaddr = (url: string) => !/\/getaddr/i.test(url) ? `${url}/getaddr` : url

      const formatURL = (url: string) => withHttps(withGetaddr(removeTrailingSlashes(url)))

      const extractedURL = values.url.match(regexpURL)
      if (extractedURL === null) {
        toast.dismiss()
        toast.error('Please enter a valid URL', { position: 'top-center', hideProgressBar: true, autoClose: 1300, closeOnClick: true, transition: Flip })
        return
      }
      const URL = formatURL(extractedURL[0])

      setSearchParams({ relayUrl: URL })
    }
  })

  const [searchParams, setSearchParams] = useSearchParams()
  if (Object.keys(relayData).length === 0 && relay.errorMsg === '') {
    const queryRelayUrl = searchParams.get('relayUrl')
    if (queryRelayUrl !== null && queryRelayUrl.length !== 0) {
      const dispatchFetchRelay = dispatch(fetchRelayData(queryRelayUrl))
      abortFetch.current = dispatchFetchRelay.abort
      return (<div>
        <p>Loading relay data...</p>
        <SwitchRelayButton abortFetch={abortFetch.current} />
      </div>)
    }
  }

  if (Object.keys(relayData).length === 0 && relay.errorMsg === '') {
    return (
      <Row className="justify-content-center">
        <Col></Col>
        <Col md="auto">
          <Form onSubmit={getRelayForm.handleSubmit}>
            <Form.Label htmlFor="url">Relay URL
              <Form.Control
                id="url"
                name="url"
                type="text"
                onChange={getRelayForm.handleChange}
                value={getRelayForm.values.url}
              />
            </Form.Label>
            <br />
            <Button style={{ width: '100%' }} variant="success" type="submit">Fetch data</Button>
          </Form>
        </Col>
        <Col></Col>
      </Row>
    )
  }
  if (relay.errorMsg !== '') {
    return (<>
      <span>{relay.errorMsg}</span>
      <br />
      <SwitchRelayButton autoFocus abortFetch={abortFetch.current} />
    </>)
  }
  if (chain?.id !== undefined && chain?.id !== chainId) {
    return (<>
      <ChainIdHandler relayChainId={chainId} />
      <SwitchRelayButton />
    </>)
  }

  if (chain?.id === chainId && Object.keys(relayData).length > 0) {
    return (
      <div className="row">
        <SwitchRelayButton />
        <div className="col-10">
          <div className="row">
            <RelayInfo />
            <RelayCommands />
          </div>
        </div>
      </div>
    )
  }

  return <>Error initializing relay view</>
}
