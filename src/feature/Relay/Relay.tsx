import { useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useNetwork } from 'wagmi'
import { useAppDispatch, useAppSelector, useIsDesktop } from '../../hooks'
import { fetchRelayData, deleteRelayData } from './relaySlice'

import { Accordion, AccordionDetails, AccordionSummary, Box, Typography, VariantType } from '../../components/atoms'

import ChainIdHandler from './components/ChainIdHandler'

import RelayInfo from './Info/Info'
import RelayCommands from './Commands/Commands'

import { PingResponse } from '../../types/PingResponse'

export default function Relay() {
  const dispatch = useAppDispatch()
  const relay = useAppSelector((state) => state.relay)
  const relayData: PingResponse = relay.relay
  const relayDataFetched = Object.keys(relayData).length > 0
  const chainId = Number(relayData.chainId)
  const { chain } = useNetwork()
  const abortFetch = useRef<unknown>()
  const isDesktop = useIsDesktop()
  const variant = isDesktop ? VariantType.H3 : VariantType.H4

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

  const connectedToWrongChainId = chain?.id !== undefined && chain?.id !== chainId && relayDataFetched

  if (relayDataFetched) {
    return (
      <Box width='95%' mx='auto' py={{ md: '50px', xs: '25px' }}>
        <Box mb='25px'>
          <Typography variant={VariantType.H2}>Relay server info</Typography>
        </Box>
        <Accordion>
          <AccordionSummary>
            <Box
              display='flex'
              flexDirection={{
                xs: 'column',
                md: 'row'
              }}
              sx={{ overflowWrap: 'anywhere' }}
            >
              <Typography fontWeight={600} variant={variant}>
                Relay address:
              </Typography>
              &nbsp;
              <Typography variant={variant}>{relay.relayUrl}</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box display='flex' alignItems='center' justifyContent='center'></Box>
            <RelayInfo />
          </AccordionDetails>
        </Accordion>
        {connectedToWrongChainId ? <ChainIdHandler relayChainId={chainId} /> : <RelayCommands />}
      </Box>
    )
  }

  return <>Error initializing relay view</>
}
