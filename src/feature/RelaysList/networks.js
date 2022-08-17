/* eslint:disable */
// use #infura=xxxx, or default one.

const infura = (document.location.href.match(/#.*infura=([^&]*)/) || [])[1] || 'f40be2b1a3914db682491dc62a19ad43'
// '127b8c9f6d0d46f69a42963b5cd0d0ac'
const gsnNetworks = require('./gsn-networks.json')
const axios = require('axios')

const chainListMiniUrl = 'https://chainid.network/chains_mini.json'

// map networks to groups
// numbers: list of chain-ids belong to this group
// string: match network "title"
const groups = {
  Ethereum: [1, 3, 4, 5, 42],
  Polygon: [137, 80001],
  Binance: 'Binance',
  Avalanche: 'Avalanche',
  Arbitrum: 'Arb',
  Optimism: 'Optimism'
}

function getGroup (chainInfo) {
  const groupName = Object.keys(groups).find(groupName => {
    const g = groups[groupName]
    if (Array.isArray(g) && g.includes(parseInt(chainInfo.chainId))) { return true }
    return chainInfo.title && chainInfo.title.includes(groupName)
  })
  if (groupName != null) { return groupName } else { return 'Other' }
}

let chainList = null

// use gsn-networks for all gsn-deployed networks.
// augment data from https://chainid.network/chains_mini.json, to add RPC
// also add group defined above.
export async function getNetworks () {
  if (!chainList) {
    const chainResponse = await axios.get(chainListMiniUrl)
    if (!chainResponse.data) {
      console.log('Bad response from', chainListMiniUrl, ':', chainResponse.response)
      throw new Error(`Failed to load chains from ${chainListMiniUrl}`)
    }
    chainList = chainResponse.data.reduce((set, chainInfo) => ({
      ...set,
      [chainInfo.chainId]: chainInfo
    }), {})

    // //hack: Nitro doesn't appear in the global network chainlist..
    // chainList[421612] = {
    //   chainId: 421612,
    //   name: 'Arbitrum Nitro Devnet',
    //   rpc: ['https://nitro-devnet.arbitrum.io/rpc'],
    // }
  }

  const networks = Object.keys(gsnNetworks).reduce((set, chainId) => {
    if (chainId.match('1337')) return set
    // if ( chainId !== '5' ) return set
    const chainListElement = chainList[chainId]
    const gsnNetwork = gsnNetworks[chainId][0]
    if (chainListElement == null) {
      console.warn('IGNORED: missing chain', chainId)
      return set
    }
    const rpc = chainListElement.rpc
    let rpcUrl
    if (rpc != null && rpc.length > 0) {
      rpcUrl = rpc[0].replace(/\${INFURA_API_KEY}/, infura)
    }

    const contracts = gsnNetwork.contracts
    const RelayHubContract = contracts.ArbRelayHub || contracts.RelayHub
    if (!RelayHubContract) {
      console.log('no hub for ', chainId, contracts)
    }
    return ({
      ...set,
      [gsnNetwork.name]: {
        chainId,
        group: getGroup(gsnNetwork),
        token: gsnNetwork.symbol,
        name: gsnNetwork.title,
        url: rpcUrl,
        etherscan: gsnNetwork.explorer + '/search?q=',
        RelayHub: RelayHubContract.address,
        RelayHubAbi: RelayHubContract.abi,
        contracts
      }
    })
  }, {})
  console.log('networks=', networks)
  return networks
}
