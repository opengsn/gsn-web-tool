import gsnNetworks from './gsn-networks.json'
import axios, { AxiosResponse } from 'axios'
import { ChainWithGsn } from '../../types/ChainWithGsn'

// const infura = (document.location.href.match(/#.*infura=([^&]*)/) || [])[1] || 'f40be2b1a3914db682491dc62a19ad43'
const infura = 'f40be2b1a3914db682491dc62a19ad43'
// '127b8c9f6d0d46f69a42963b5cd0d0ac'

const chainListMiniUrl = 'https://chainid.network/chains_mini.json'

// map networks to groups
// numbers: list of chain-ids belong to this group
// string: match network "title"
interface groupsMapped {
  [key: string]: string | number[]
}
const groups = {
  Ethereum: [1, 3, 4, 5, 42],
  Polygon: [137, 80001],
  Binance: 'Binance',
  Avalanche: 'Avalanche',
  Arbitrum: 'Arb',
  Optimism: 'Optimism'
}

function getGroup (chainInfo: any) {
  const groupName = Object.keys(groups).find(groupName => {
    const g = (groups as groupsMapped)[groupName]
    if (Array.isArray(g) && g.includes(parseInt(chainInfo.chainId))) { return true }
    return chainInfo.title?.includes(groupName)
  })
  if (groupName != null) { return groupName } else { return 'Other' }
}

// use gsn-networks for all gsn-deployed networks.
// augment data from https://chainid.network/chains_mini.json, to add RPC
// also add group defined above.

interface ChainListNetwork {
  name: string
  chainId: number
  rpc: string[]
  shortName: string
  faucets: string[]
  nativeCurrency?: {
    decimals: number
    name: string
    symbol: string
  }
}

interface ChainListNetworkSet {
  [key: number]: ChainListNetwork
}

let chainList: any | null = null

export async function getNetworks (): Promise<ChainWithGsn[]> {
  if (chainList === null) {
    try {
      // const chainResponse = await axios.get(chainListMiniUrl)
      const chainResponse = await axios.get<string, AxiosResponse<ChainListNetwork[]>>(chainListMiniUrl)
      if (chainResponse.data === null) {
        // console.log('Bad response from', chainListMiniUrl, ':', chainResponse.response.data)
        throw new Error(`Failed to load chains from ${chainListMiniUrl}`)
      }
      chainList = chainResponse.data.reduce((set: ChainListNetworkSet, chainInfo: ChainListNetwork) => {
        return ({
          ...set,
          [chainInfo.chainId]: chainInfo
        })
      }, {})
    } catch (e: any) {
      console.error(e)
      throw new Error()
    }
    // //hack: Nitro doesn't appear in the global network chainlist..
    chainList[421612] = {
      chainId: 421612,
      name: 'Arbitrum Nitro Devnet',
      faucets: [],
      shortName: 'arbnitro',
      rpc: ['https://nitro-devnet.arbitrum.io/rpc']
    }
    // if (chainList[43113] !== undefined) {
    //   // allows querying events 5000 blocks back
    //   chainList[43113].rpc = ['https://avalanchetestapi.terminet.io/ext/bc/C/rpc']
    // }
  }

  const availableChains = Object.keys(gsnNetworks).reduce<ChainWithGsn[]>((set, chainId) => {
    const gsnNetwork = (gsnNetworks as { [key: string]: any })[chainId][0]
    if (!('symbol' in gsnNetwork)) return set
    if (chainId === '1337') return set
    if (chainList === null) return set
    const contracts = gsnNetwork.contracts as unknown as any
    // if (Object.keys(contracts).length === 0) return set
    // if ( chainId !== '5' ) return set
    const chainListElement = chainList[chainId]
    if (chainListElement == null) {
      console.warn('IGNORED: missing chain', chainId)
      return set
    }

    let rpcUrl
    if ('rpc' in chainListElement && chainListElement.rpc.length > 0) {
      const rpc = chainListElement.rpc
      rpcUrl = rpc[0].replace(/\${INFURA_API_KEY}/, infura)
    }

    let RelayHubContract
    if (contracts.ArbRelayHub !== undefined) {
      RelayHubContract = contracts.ArbRelayHub
    } else if (contracts.RelayHub !== undefined) {
      RelayHubContract = contracts.RelayHub
    } else {
      console.log('no hub for ', chainId)
      return set
    }

    let symbol
    if ('symbol' in gsnNetwork) {
      symbol = gsnNetwork.symbol
    } else {
      symbol = 'unknown'
    }

    let blockExplorers
    if ('explorer' in gsnNetwork) {
      // eslint-disable-next-line
      blockExplorers = { default: { name: 'test', url: gsnNetwork['explorer'] } }
    } else {
      blockExplorers = { default: { name: 'localhost', url: 'localhost.com' } }
    }

    return ([
      ...set,
      {
        id: parseInt(chainId),
        network: gsnNetwork.name,
        name: gsnNetwork.title,
        rpcUrls: { default: { http: [rpcUrl] } },
        nativeCurrency: { decimals: 18, symbol, name: symbol },
        blockExplorers,
        gsn: {
          group: getGroup(gsnNetwork),
          relayHubAddress: RelayHubContract.address,
          RelayHubAbi: RelayHubContract.abi,
          contracts
        }
      }
    ])
  }, [])

  const wrappedNativeCurrency: { [key: string]: string } = {
    'gsn-test': '0x5fbdb2315678afecb367f032d93f642f64180aa3',
    ropsten: '0x1368e39E3CB40C3dFb06d2cB8E5fca6a847D16E6',
    goerli: '0xE8172A9bf53001d2796825AeC32B68e21FDBb869',
    kopt: '0x0b9D225C6A347eC2D12F664b85CB11B735BFc86d',
    'go-testnet': '0xc6e7DF5E7b4f2A278906862b61205850344D4e7d',
    fuji: '0xb4Bbb5e968e278C6541addBC24b903712746f102',
    maticmum: '0xBA03B53D826207c39453653f655d147d4BCBA7B4',
    rarb: '0x4C6cc053d802fF96952c825CB4c490c4A5E59f88',
    nitro: '0xE1594A543399953A65E88570927A89765b6d06d1'
  }

  const allChainsWithWrapped: ChainWithGsn[] = availableChains.map((chain) => {
    return { ...chain, stakingTokens: [wrappedNativeCurrency[chain.network]] }
  })

  return allChainsWithWrapped
}
