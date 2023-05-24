import { useRef, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useNetwork } from 'wagmi'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { fetchRelayData, deleteRelayData } from './relaySlice'

import { Accordion, AccordionSummary, Alert, Box, Divider, Typography } from '../../components/atoms'

import RelayInfo from './Info/RelayInfo'
import RelayCommands from './Commands/Commands'

import { PingResponse } from '../../types/PingResponse'
import ChainIdHandler from './components/ChainIdHandler'
import SuccessModal from '../../components/molecules/SuccessModal'

export default function Relay() {
  const dispatch = useAppDispatch()
  const relay = useAppSelector((state) => state.relay)
  const relayData: PingResponse = relay.relay
  const currentStep = useAppSelector((state) => state.register.step)
  const relayDataFetched = Object.keys(relayData).length > 0
  const chainId = Number(relayData.chainId)
  const { chain } = useNetwork()
  const abortFetch = useRef<unknown>()
  const [expanded, setExpanded] = useState<boolean>(false)
  const variant = 'body1'

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
          <Typography variant='h4' fontWeight={600}>
            Relay server info
          </Typography>
        </Box>
        <Accordion expanded={expanded}>
          <AccordionSummary
            onChange={(event) => {
              setExpanded((prev) => !prev)
            }}
          >
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
        {relay.relay.ready
          ? (
          <></>
            )
          : (
          <>{connectedToWrongChainId ? <ChainIdHandler relayChainId={chainId} /> : <RelayCommands />} </>
            )}
        {currentStep === 6 && <SuccessModal />}
      </Box>
    )
  }

  return <Alert severity='error'>Error initializing relay view</Alert>
}
