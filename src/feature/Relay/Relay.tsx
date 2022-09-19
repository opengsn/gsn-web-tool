import { useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useNetwork } from 'wagmi'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { fetchRelayData, deleteRelayData } from './relaySlice'

import Alert from 'react-bootstrap/Alert'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'

import ChainIdHandler from './components/ChainIdHandler'

import RelayInfo from './Info/Info'
import RelayCommands from './Commands/Commands'

import { PingResponse } from '../../types/PingResponse'

export default function Relay () {
  const dispatch = useAppDispatch()
  const relay = useAppSelector((state) => state.relay)
  const relayData: PingResponse = relay.relay
  const relayDataFetched = (Object.keys(relayData).length > 0)
  const chainId = Number(relayData.chainId)
  const { chain } = useNetwork()
  const abortFetch = useRef<unknown>()

  const [searchParams] = useSearchParams()

  useEffect(() => {
    const queryRelayUrl = searchParams.get('relayUrl')
    if (queryRelayUrl !== null && queryRelayUrl.length !== 0 && relay.errorMsg === '' && !relayDataFetched) {
      const dispatchFetchRelay = dispatch(fetchRelayData(queryRelayUrl))
      abortFetch.current = dispatchFetchRelay.abort
    } else if (queryRelayUrl === null) {
      dispatch(deleteRelayData())
    }
  }, [relay.relayUrl, searchParams, dispatch, relay.errorMsg, relayDataFetched])

  const connectedToWrongChainId = (chain?.id !== undefined && chain?.id !== chainId && relayDataFetched)

  if (chain?.id !== undefined && chain?.id !== chainId && relayDataFetched) {
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
      </Col>
      <Col></Col>
    </>)
  }

  if (relayDataFetched) {
    return (
      <Row className="mx-4">
        <Card className="border border-bottom-0 rounded-0"><Card.Body>{relay.relayUrl}</Card.Body></Card>
        <RelayInfo />
        {connectedToWrongChainId
          ? <ChainIdHandler relayChainId={chainId} />
          : <RelayCommands />
        }
      </Row>
    )
  }

  return <>Error initializing relay view</>
}
