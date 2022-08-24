import { Address } from '@opengsn/common'
import { useContract, useContractRead, useProvider } from 'wagmi'
import { ChainWithGsn } from '../../networks'
import RelayRegistrarAbi from '../../contracts/relayRegistrar.json'
import { constants, ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { ArrowRepeat } from 'react-bootstrap-icons'
import axios from 'axios'
import { Card, ListGroup, Spinner, Table } from 'react-bootstrap'
import { toast } from 'react-toastify'

interface GsnStatusProps {
  network: ChainWithGsn
}

export default function GsnStatusNew ({ network }: GsnStatusProps) {
  const [relayData, setRelayData] = useState<Array<{ url: string, manager: string }>>([])
  const [refreshNetworkList, setRefreshNetworkList] = useState(false)

  const { relayHubAddress, RelayHubAbi } = network.gsn
  const chainId = network.id

  const provider = useProvider({ chainId })

  const { data: hubStateData } = useContractRead({
    addressOrName: relayHubAddress,
    contractInterface: RelayHubAbi,
    functionName: 'getConfiguration',
    chainId
  })

  const { data: versionData } = useContractRead({
    addressOrName: relayHubAddress,
    contractInterface: RelayHubAbi,
    functionName: 'versionHub',
    chainId
  })

  const { data: registrarData, refetch: refetchRegistrarData } = useContractRead({
    addressOrName: relayHubAddress,
    contractInterface: RelayHubAbi,
    functionName: 'getRelayRegistrar',
    chainId
  })
  const registrarAddress = registrarData as unknown as Address

  function formatDays (days: any) {
    if (days > 2) { return `${Math.round(days)} days` }
    const hours = days * 24
    if (hours > 2) { return `${Math.round(hours)} hrs` }

    const min = hours * 60
    return `${Math.round(min)} mins`
  }

  useEffect(() => {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    const fetchRegistrarData = async () => {
      const registrar = new ethers.Contract(registrarAddress, RelayRegistrarAbi, provider)
      try {
        const data = await registrar.readRelayInfos(relayHubAddress)
        const parseUrl = (x: any) => {
          const test = ethers.utils.toUtf8String(ethers.utils.hexConcat(x)).split(' ').join('')
          console.log(test)
        }

        for await (const url of data.map((info: any) => parseUrl(info.urlParts))) {

        }
      } catch (e: any) {
        console.log(e)
        // TODO: display error message
        setRelayData([])
      }
      setRefreshNetworkList(false)
    }

    if (registrarAddress !== undefined) {
      fetchRegistrarData().catch(console.error)
    }

    return () => {
      setRelayData([])
      source.cancel('Cancelled')
    }
  }, [registrarAddress])

  useEffect(() => {

  })

  const RelaysTable =
    <Table>
      <thead>
        <th>url</th>
        <th>manager</th>
      </thead>
      <tbody>
        {relayData.map((x) => {
          return <>
            <tr key={x.manager}>
              <td>
                {x.url}
              </td>
              <td>
                {x.manager}
              </td>
            </tr>
          </>
        })}
      </tbody>
    </Table>

  const NetworkHeader = () => {
    const handleRefetchRegistrarData = async () => {
      refetchRegistrarData()
        .catch(() => toast.error(`Error refreshing data for ${network.name}`))
    }

    return (<Card.Header>
      <span>Network: {network.gsn.group} - {network.name}{' '}</span>
      <ArrowRepeat
        onClick={() => { handleRefetchRegistrarData().catch(console.error) }}
        style={{ animation: 'spin 0.5s infinite linear' }}
      ></ArrowRepeat>
    </Card.Header>)
  }

  const NetworkBody = () => {
    const ver = (version: string) => version.replace(/\+opengsn.*/, '')

    return (
      <Card.Body>
        <ListGroup>
          <ListGroup.Item>
            RelayHub: {relayHubAddress}, <b>{typeof versionData === 'string' ? ver(versionData) : '(no version)'}</b>
          </ListGroup.Item>
          {hubStateData !== undefined
            ? <>
              <ListGroup.Item>
                Stake: lock time {formatDays(hubStateData.minimumUnstakeDelay)}.
                {/* {hubStateData.stakeTokenInfos !== undefined
              ? { hubStateData.stakeTokenInfos.map((x: any) => { return <span key={x}>{x}</span> }) }
              : null
            } */}
              </ListGroup.Item>
              <ListGroup.Item>
                Relay Fee: {ethers.utils.formatUnits(hubStateData.baseRelayFee, 'gwei')} gwei + {hubStateData.pctRelayFee}%
              </ListGroup.Item>
            </>
            : <span>unable to fetch data from hub?</span>
          }
        </ListGroup>
        {relayData.length === 0 ? <Spinner animation='grow' variant='dark' /> : null}
        {RelaysTable}
      </Card.Body>
    )
  }

  return <Card className="mt-4">
    <NetworkHeader />
    <NetworkBody />
  </Card>
}
