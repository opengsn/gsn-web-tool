import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useNetwork } from 'wagmi'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { fetchRelayData, deleteRelayData } from './relaySlice'

import { Accordion, AccordionSummary, Alert, Box, Button, CircularProgress, Typography } from '../../components/atoms'

import RelayInfo from './Info/RelayInfo'
import RelayCommands from './Commands/Commands'

import { PingResponse } from '../../types/PingResponse'
import ChainIdHandler from './components/ChainIdHandler'
import SuccessModal from '../../components/molecules/SuccessModal'
import BlockExplorerUrl from '../GsnStatus/components/BlockExplorerUrl'

export default function Relay() {
  const dispatch = useAppDispatch()
  const relay = useAppSelector((state) => state.relay)
  const relayData: PingResponse = relay.relay
  const currentStep = useAppSelector((state) => state.register.step)
  const relayDataFetched = Object.keys(relayData).length > 0
  const chainId = Number(relayData.chainId)
  const { chain } = useNetwork()
  const [expanded, setExpanded] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const [searchParams] = useSearchParams()

  const fetchData = async () => {
    setLoading(true)
    const queryRelayUrl = searchParams.get('relayUrl')
    if (queryRelayUrl !== null && queryRelayUrl.length !== 0 && relay.errorMsg === '' && !relayDataFetched) {
      await dispatch(fetchRelayData(queryRelayUrl))
    } else if (queryRelayUrl === null) {
      await dispatch(deleteRelayData())
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [relay.relayUrl, searchParams, dispatch, relay.errorMsg, relayDataFetched])

  const connectedToWrongChainId = chain?.id !== undefined && chain?.id !== chainId && relayDataFetched

  if (relayDataFetched) {
    return (
      <Box width='95%' mx='auto' py='20px'>
        <Accordion expanded={expanded}>
          <AccordionSummary
            onChange={(event) => {
              setExpanded((prev) => !prev)
            }}
            isManage={true}
          >
            <Box width='100%' p='10px'>
              <Button.Unstyled
                onClick={(event) => {
                  setExpanded((prev) => !prev)
                }}
              >
                <Box
                  sx={(theme) => ({
                    bgcolor: theme.palette.primary.relayHubBG,
                    p: 5
                  })}
                >
                  <Typography variant='h6' fontWeight={600}>
                    Relay Server URL:
                  </Typography>
                  &nbsp;
                  <BlockExplorerUrl address={relay.relayUrl} url={relay.relayUrl} truncate={false} />
                </Box>
              </Button.Unstyled>
              <Box width='100%'>
                <Box mt='15px'>
                  <RelayInfo showAllInfo={expanded} />
                </Box>
              </Box>
            </Box>
          </AccordionSummary>
        </Accordion>
        {relay.relay.ready ? <></> : <>{connectedToWrongChainId ? <ChainIdHandler relayChainId={chainId} /> : <RelayCommands />} </>}
        {currentStep === 6 && <SuccessModal />}
      </Box>
    )
  }

  return loading
    ? (
    <CircularProgress />
      )
    : relayData
      ? null
      : (
    <Alert severity='error'>
      <Typography variant='h6' fontWeight={600}>
        Error initializing relay view
      </Typography>
    </Alert>
        )
}
