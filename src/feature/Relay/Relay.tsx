import { useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useNetwork } from 'wagmi'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { useFormik } from 'formik'
import { fetchRelayData, deleteRelayData } from './relaySlice'

import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'

import ChainIdHandler from '../../components/ChainIdHandler'

import RelayInfo from '../RelayInfo/Info'
import RelayCommands from '../RelayCommands/Commands'

import { PingResponse } from '@opengsn/common'
import { toast, Flip } from 'react-toastify'

export default function Relay () {
  const dispatch = useAppDispatch()
  const relay = useAppSelector((state) => state.relay)
  const relayData: PingResponse = relay.relay
  const relayDataFetched = (Object.keys(relayData).length > 0)
  const chainId = Number(relayData.chainId)
  const { chain, chains } = useNetwork()
  const abortFetch = useRef<unknown>()

  const getRelayForm = useFormik({
    initialValues: {
      url: relay.relayUrl
    },
    enableReinitialize: true,
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
      if (relay.errorMsg !== '') {
        dispatch(fetchRelayData(URL)).catch(console.error)
      }

      setSearchParams({ relayUrl: URL })
    }
  })

  const [searchParams, setSearchParams] = useSearchParams()
  useEffect(() => {
    const queryRelayUrl = searchParams.get('relayUrl')
    if (queryRelayUrl !== null && queryRelayUrl.length !== 0 && relay.errorMsg === '') {
      const dispatchFetchRelay = dispatch(fetchRelayData(queryRelayUrl))
      abortFetch.current = dispatchFetchRelay.abort
    } else if (queryRelayUrl === null) {
      dispatch(deleteRelayData())
    }
  }, [relay.relayUrl, searchParams, dispatch, relay.errorMsg])

  if (!relayDataFetched) {
    return (<>
      <Col md="2"></Col>
      <Col md="auto" className="flex-fill">
        {relay.loading
          ? <span>Loading data...</span>
          : null}
        {relay.errorMsg !== ''
          ? <Alert variant="danger">
            <span>Error: {relay.errorMsg}</span>
          </Alert>
          : null}
        <Form className="row" onSubmit={getRelayForm.handleSubmit}>
          {/* URL from query  */}
          {searchParams.get('relayUrl') === null
            ? <>
              <Form.Label htmlFor="url">Relay URL
                <InputGroup><Form.Control
                  id="url"
                  name="url"
                  type="text"
                  onChange={getRelayForm.handleChange}
                  value={getRelayForm.values.url}
                />
                </InputGroup></Form.Label>
              <Button variant="success" type="submit">Fetch data</Button>
            </>
            : null}
        </Form>
      </Col>
      <Col></Col>
    </>)
  }

  const connectedToWrongChainId = (chain?.id !== undefined && chain?.id !== chainId && relayDataFetched)
  if (relayDataFetched) {
    return (
      <div className="col-10">
        <div className="row">
          <RelayInfo />
          {connectedToWrongChainId
            ? <ChainIdHandler relayChainId={chainId} />
            : null}
          <RelayCommands />
        </div>
      </div>
    )
  }

  return <>Error initializing relay view</>
}
