import { useRef, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useNetwork } from 'wagmi'
import { useAppDispatch, useAppSelector, useIsDesktop } from '../../hooks'
import { fetchRelayData, deleteRelayData } from './relaySlice'

import { Accordion, AccordionSummary, Box, Divider, Typography, VariantType } from '../../components/atoms'

import ChainIdHandler from './components/ChainIdHandler'

import RelayInfo from './Info/RelayInfo'
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
  const [expanded, setExpanded] = useState<boolean>(false)
  const variant = isDesktop ? VariantType.H4 : VariantType.H5

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
      <Box width='95%' mx='auto' py='25px'>
        <Box mb='25px' textAlign='center'>
          <Typography variant={VariantType.H2}>Relay server info</Typography>
        </Box>
        <Accordion
          expanded={expanded}
          onChange={(event, isExpanded) => {
            setExpanded(isExpanded)
          }}
        >
          <AccordionSummary>
            <Box width='100%' p='10px'>
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
              <Box my='10px'>
                <Divider />
              </Box>
              <Box>
                <RelayInfo showAllInfo={expanded} />
              </Box>
            </Box>
          </AccordionSummary>
        </Accordion>
        {connectedToWrongChainId ? <ChainIdHandler relayChainId={chainId} /> : <RelayCommands />}
      </Box>
    )
  }

  return <>Error initializing relay view</>
}
