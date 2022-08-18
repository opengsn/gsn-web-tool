/* eslint-disable */
import React from 'react'

import { Table, Card, Form, ButtonGroup } from 'react-bootstrap'

import Web3 from 'web3'
import StakeManagerAbi from '../../contracts/stakeManager.json'
import axios from 'axios'
import EventEmitter from 'events'
import { NetworkLinks } from './components/NetworkLinks'
import './RelaysList.css'

import { SparkLine } from './SparkLine'
import { isSameAddress as same, sleep } from '@opengsn/common'
import { Contract, providers, utils } from 'ethers'
import { getNetworks } from './networks'
import { Navigate } from 'react-router-dom'

const { formatUnits, formatEther } = utils
// global.web3 = new Web3(p)
// let addr='0x'+'0'.repeat(40)

const showDetailStatus = window.location.href.match(/#.*debug/)
// global.web3.eth.getBalance(addr).then(b=>console.log( 'bal=', b/1e18))
// import './App.css';
const removedRelays = {}
const globalevent = new EventEmitter()

// # of active relayers per network (displayed by NetworkLinks)
const relayCounts = {}
// new Web3.providers.HttpProvider(network))
// let hubaddr = '0xD216153c06E857cD7f72665E0aF1d7D82172F494'

const BLOCK_HISTORY_COUNT = 6000 * 30 * 30
const GETADDR_TIMEOUT = 5 * 1000

// eslint-disable-next-line
class RelayInfo extends React.Component {
  constructor (props) {
    super(props)
    this.state = { showCommands: false }
  }

  render() {
    const relay = this.props.relay
    const network = this.props.network

    return <Card><Card.Body>
      <Card.Title> <RelayUrl url={relay.url} /></Card.Title>
      <Card.Subtitle>Status: <Status status={relay.status} />
        <Address addr={relay.addr} network={network} />
      </Card.Subtitle>
      txfee: {relay.txfee}%, Bal:<Balance val={relay.bal} /> owner: {relay.owner}
    </Card.Body></Card>
  }
}

// simple stateless components:

// 200b is zero-width space (allow wrapping.)
const RelayUrl = ({ url }) => <a href={`${url}/getaddr`}
  target="relayurl">{url.replace(/http(s)?:\/\//, '').replace(/[.]/g, '\u200B.')}</a>

function toList(x) {
  if (Array.isArray(x)) return x
  return [x]
}

// eslint-disable-next-line
let Balance = ({ val, counter = 0 }) => <span> {toList(val).map(val => {
  return <span key={++counter}>{val || val === 0 ? val.toFixed(6) : 'n/a'}<br /></span>
})} </span>

function formatDays(days) {
  if (!days) return ''
  if (days > 2) { return Math.round(days) + ' days' }
  const hours = days * 24
  if (hours > 2) { return Math.round(hours) + ' hrs' }

  const min = hours * 60
  return Math.round(min) + ' mins'
}

function TokenValueInfo({ tokenInfo, index, count }) {
  const suffix = index + 1 < count ? ', ' : ''
  if (!tokenInfo) return ''
  const { value, decimals, symbol } = tokenInfo
  return formatUnits(value, decimals) + ' ' + symbol + suffix
}

const HubStatus = ({ ver, net, countsPerDay, counts, stakeTokenInfos, unstakedelayDays, baseRelayFee, pctRelayFee }) =>
  <span>
    <b>{ver}</b><br />
    Stake: lock time {formatDays(unstakedelayDays)}, tokens: {stakeTokenInfos.map((info, index) => <TokenValueInfo key={index} index={index} tokenInfo={info} index={index} count={stakeTokenInfos.length} />)}
    {baseRelayFee && <div>Relay Fee: {formatUnits(baseRelayFee || '', 'gwei')} gwei + {pctRelayFee}%</div>}
    {(showDetailStatus != null) && counts.month !== 0 && <table border="1">
      <tbody>
        <tr>
          <td>Counts in the past</td>
          <td> hour:{counts.hour}</td>
          <td> day:{counts.day} </td>
          <td> week:{counts.week}</td>
          <td> month:{counts.month}</td>
          <td><SparkLine data={countsPerDay} /></td>
        </tr>
      </tbody>
    </table>
    }
  </span>

function RelayStats({ mgr, eventsInfo }) {
  if (!eventsInfo || (showDetailStatus == null)) return <span />
  const { hour, day, week, month } = mgrStats(eventsInfo, mgr)
  const data = sparklineData(eventsInfo, mgr)
  return <div>
    {hour}/{day}/{week}/{month}
    {month !== 0 && <SparkLine data={data}></SparkLine>}
  </div>
}

async function getBlockNumber(web3) {
  while (true) {
    try {
      // console.log('== before getBlockNumber')
      return await web3.eth.getBlockNumber()
    } catch (e) {
      // console.log('=== failed to get block, e=', e.message)
      await sleep(5000)
    } finally {
      // console.log('== AFTER getBlockNumber')

    }
  }
}

// eslint-disable-next-line
async function getPastEvents(contract, eventName, options) {
  console.log('== getPastEvents', eventName, options, options.toBlock - options.fromBlock)
  const web3 = contract.web3
  try {
    return await contract.getPastEvents(eventName, options)
  } catch (e) {
    console.log('parsing error', e.message)
    let range
    const last = options.toBlock || await getBlockNumber(web3) - 10
    if (e.message.match('block range is too wide')) {
      // hack: avalanche ANKR provider allows any block range if no "toBlock"
      console.log('HACK for avax')
      return await contract.getPastEvents(eventName, { ...options, toBlock: undefined })
    } else if (e.message.match(/(more than)|(too many blocks)/)) {
      range = Math.trunc(last - options.fromBlock) / 10
    } else {
      const matchrange = e.message.match(/block range.*\b(\d+)/)
      if (!matchrange) { throw e }
      range = parseInt(matchrange[1])
    }
    const list = []
    const from = options.fromBlock
    for (let i = last - range; (i - range) > from; i -= range) {
      const newOptions = { ...options, fromBlock: i, toBlock: i + range }
      console.log('===', newOptions)
      list.push(contract.getPastEvents(eventName, newOptions))
    }
    console.log('=== runnning parallel: ', list.length)
    const all = await Promise.all(list)
    return all.flat()
  }
}

async function collectEventsInfo(web3, hub, net) {
  // calc time per block:
  const { number, timestamp } = await web3.eth.getBlock('latest')
  const N = 100000
  const ts = await web3.eth.getBlock(number - N).then(b => b.timestamp)
  const secPerBlock = (timestamp - ts) / N
  const blocksPerHour = Math.trunc(3600 / secPerBlock)
  const fromBlock = number - blocksPerHour * 24 * 40
  if (number - fromBlock > net.lookupWindow * 10) {
    console.log('unable to collect events for range', number - fromBlock)
    return { events: [], number, blocksPerHour }
  }

  const events = await getPastEvents(hub, 'TransactionRelayed', { fromBlock, toBlock: number })
  // hack to support old (alpha) relayhub events
  // if ( events.length===0 ) {
  //   const hubAlpha = new web3.eth.Contract(RelayHubAlphaAbi, hub._address)

  //   events = await hubAlpha.getPastEvents('TransactionRelayed', {fromBlock: number- blocksPerHour*24*40, toBlock: number})
  // }

  return { events, number, blocksPerHour }
}

function collectStats(collectEventsInfoRes, filter) {
  const { events, number, blocksPerHour } = collectEventsInfoRes
  let hour = 0; let day = 0; let week = 0; let month = 0
  events.filter(filter).forEach(e => {
    const blockPast = number - e.blockNumber
    if (blockPast < blocksPerHour) hour++
    if (blockPast < blocksPerHour * 24) day++
    if (blockPast < blocksPerHour * 24 * 7) week++
    if (blockPast < blocksPerHour * 24 * 30) month++
  })
  return { hour, day, week, month }
}

function mgrFilter(worker) {
  return e => e.returnValues.relayManager.toLowerCase() === worker.toLowerCase()
}

function sparklineData(collectEventsInfoRes, mgr) {
  if (!collectEventsInfoRes) return []
  const filter = mgr ? mgrFilter(mgr) : () => true
  const { events, number, blocksPerHour } = collectEventsInfoRes
  // bins are not "day" but "day/4" (should be renamed "bin")
  const historyDays = 30 * 2
  const blocksPerDay = 24 * blocksPerHour / 2
  const lastMonthBlock = number - historyDays * blocksPerDay

  const counts =
    events.filter(filter).filter(e => e.blockNumber > lastMonthBlock)
      .map(e => Math.round((e.blockNumber - lastMonthBlock) / blocksPerDay))
      .reduce((list, val) => {
        list[val] = (list[val] || 0) + 1
        return list
      }, [])

  // counts is a "sparse" array, with counts in all days, but "empty" on zero-days.
  // these zero-days are not "real" array elements: e.g. not returned by "forEach" etc.

  const ret = new Array(historyDays)
  for (let i = 1; i <= historyDays; i++) {
    ret[i - 1] = counts[i] || 0
  }
  return ret
}

function hubStats(collectEventsInfoRes) {
  return collectStats(collectEventsInfoRes, () => true)
}

function mgrStats(collectEventsInfoRes, mgr) {
  return collectStats(collectEventsInfoRes, mgrFilter((mgr)))
}

const Address = ({ addr, network }) => <a href={network.etherscan + addr} target="etherscan">
  <font family="monospaces">{addr ? addr.replace(/^0x/, '').slice(0, 8) + '\u2026' : 'null'} </font></a>

class GsnStatus extends React.Component {
  async updateRelays() {
    const web3 = this.web3

    const curBlockNumber = await getBlockNumber(web3)

    const net = this.props.networks[this.props.network]
    const blockhistorycount = net.lookupWindow || BLOCK_HISTORY_COUNT
    // console.log('== hist', blockhistorycount, net)
    const fromBlock = Math.max(1, curBlockNumber - blockhistorycount)
    const hub = new web3.eth.Contract(this.state.network.RelayHubAbi, this.state.network.RelayHub)

    // TODO: temporary solution, until we have a package that exposes getConfiguration
    // (we still need backward-compatible API to show older versions)
    const registrarAddr = await hub.methods.getRelayRegistrar().call().catch(e => null)
    if (registrarAddr != null) {
      // new 3-alpha... new events needed..
      this.registrar = new web3.eth.Contract(this.state.network.contracts.RelayRegistrar.abi, registrarAddr)
    }

    const creationBlockPromise = hub.methods.getCreationBlock().call()
    hub.methods.getConfiguration().call().then(async (conf) => {
      // todo: minimum stake is per-token.
      this.state.hubstate.unstakedelayDays = conf.minimumUnstakeDelay / 3600 / 24
      this.state.hubstate.pctRelayFee = conf.pctRelayFee
      this.state.hubstate.baseRelayFee = conf.baseRelayFee
      const fromBlock = await creationBlockPromise
      let toBlock = parseInt(fromBlock) + 2000
      if (toBlock > curBlockNumber) {
        toBlock = curBlockNumber
      }

      // TODO: the following code only read tokens in the first 2000 blocks after relayHub creation.
      // this probably means it will miss newer staking tokens.
      // Also, should remove duplicates (modification of token within this block range)
      const events = await hub.getPastEvents('StakingTokenDataChanged', { fromBlock, toBlock })
      const stakeTokenInfos = await Promise.all(
        events.map(async (event) => {
          const { token, minimumStake } = event.returnValues
          const provider = new providers.Web3Provider(web3.currentProvider)

          const tokenContract = new Contract(token, [
            'function symbol() view returns (string)',
            'function decimals() view returns (uint)'
          ], provider)

          const [symbol, decimals] = await Promise.all([
            tokenContract.symbol(),
            tokenContract.decimals()
          ])
          const stakeTokenInfo = {
            address: token,
            symbol,
            decimals,
            value: minimumStake
          }
          console.log('tokeninfo=', stakeTokenInfo)
          return stakeTokenInfo
        })
      )
      this.setState({
        stakeTokenInfos
      })
    })
    hub.methods.versionHub().call().then(ver => {
      this.state.hubstate.version = ver.replace(/\+opengsn.*/, '')
    }).catch(err => this.state.hubstate.version = '(no version)')

    let res
    if (this.registrar) {
      // 1. no need for events (and no SM events to "unregister" relayers)
      // 2. one-click to all registered relayers..
      // 3. generate "event-like" objects from infos (so the old code below, which parses events,
      // can work as-is..)
      const relayInfos = await this.registrar.methods.readRelayInfos(hub._address).call()
      res = relayInfos.map(info => ({
        returnValues: {
          relayManager: info.relayManager,
          relayUrl: Buffer.from(info.urlParts.join('').replace(/0x/g, '').replace(/(00)*$/, ''), 'hex').toString()
        }
      }))
    } else {
      collectEventsInfo(web3, hub, net).then(res => {
        this.eventsInfo = res
        this.state.hubstate.counts = hubStats(this.eventsInfo)
      }).finally(() => {
        this.updateDisplay()
      })
    }
    this.state.relaysDict = {}
    this.state.ownersDict = {}

    const relays = this.state.relaysDict
    if (!this.registrar) {
      hub.methods.stakeManager().call().then(async sma => {
        const sm = new web3.eth.Contract(StakeManagerAbi, sma)
        const smEvents = await sm.getPastEvents(null, { fromBlock: 0x1 }).catch(e => {
          console.log('smevents error=', e.message)
          return []
        })
        smEvents.forEach(e => {
          if (e.event === 'HubUnauthorized' || e.event === 'StakeUnlocked') {
            // we don't know if we processs this unstaked/unlocked event or "RelayRegistered" event first.
            // so we mark it in removedRelays, AND remove it from relays, just in case..
            const relayManager = e.returnValues.relayManager
            removedRelays[relayManager] = 1
            console.log('== removing relay', net.name, e.event, relayManager, (relays[relayManager] || {}).url)
            delete relays[relayManager]
            this.updateDisplay()
          }
        })
      })
      const pastEventsAsync = getPastEvents(hub, 'RelayServerRegistered', { fromBlock, toBlock: curBlockNumber })

      // let start = Date.now()
      res = await pastEventsAsync
      // let elapsed = Date.now() - start
    }

    // console.log( '===network=',this.state.network.name, "events time=", elapsed)

    const owners = this.state.ownersDict

    function owner(relay) {
      const h = relay.owner
      if (!owners[h]) {
        const url = relay.url || relay.relayUrl
        const name = (((url + '/').match(/\b(\w+)(\.\w+)?(:\d+)?\//) != null) || [])[1]
        owners[h] = {
          addr: h,
          name: name || 'owner-' + (Object.keys(owners).length + 1)
        }
      }
      return owners[h].name
    }

    let counter = 0

    const visited = {}
    res.reverse().forEach(e => {
      const r = e.returnValues

      counter++
      if (counter === 123) {
        // counter=1;
        r.url = 'https://relay1.duckdns.org:1234'
      }
      if (removedRelays[r.relayManager]) {
        return
      }
      // r.url = 'https://34.89.42.190'
      let timeoutId
      const setStatus = (status, worker) => {
        // skip removed (unstaked) relays
        if (!relays[r.relayManager]) { return }

        relays[r.relayManager].status = status
        if (status.level === 'green') {
          const net = this.props.network
          relayCounts[net] = relayCounts[net] + 1 || 1
        }
        if (worker) {
          const rr = relays[r.relayManager]
          rr.worker = worker
          web3.eth.getBalance(worker).then(bal => {
            if (!rr.bal) { rr.bal = [] }
            rr.bal[1] = bal / 1e18
            this.updateDisplay()
          })
        } else {
          this.updateDisplay()
        }
        clearTimeout(timeoutId)
      }

      if (visited[r.relayManager]) return
      visited[r.relayManager] = 1
      timeoutId = setTimeout(() => {
        setStatus({ level: 'orange', value: 'Timed-out' })
      }, GETADDR_TIMEOUT)
      axios.get(r.relayUrl + '/getaddr', { timeout: GETADDR_TIMEOUT, json: true })
        .then(ret => {
          // support both beta.3 and older (beta.2, v0.9) response
          const ready = ret.data.Ready || ret.data.ready
          const version = ret.data.Version || ret.data.version || ''
          const worker = ret.data.RelayServerAddress || ret.data.relayWorkerAddress
          const manager = ret.data.RelayManagerAddress || ret.data.relayManagerAddress
          const status = !same(r.relayManager, manager)
            ? { level: 'magenta', value: 'addr-mismatch' }
            : ready ? { level: 'green', value: 'Ready ' + version } : { level: 'orange', value: 'pending ' + version }
          setStatus(status, worker)
          //            this.updateDisplay()
        })
        .catch(err => {
          if (/timeout/.test(err.toString())) {
            setStatus({ level: 'orange', value: 'Timeout' })
          } else {
            setStatus({
              level: 'red',
              value: err.error && err.error.code ? err.error.code : err.message || err.toString()
            })
          }
        })

      web3.eth.getBalance(r.relayManager)
        .then(bal => {
          const rr = relays[r.relayManager]
          if (rr) {
            if (!rr.bal) rr.bal = []
            rr.bal[0] = bal / 1e18
            this.updateDisplay()
          }
        })

      const aowner = owner(r)
      // console.log( e.blockNumber, e.event, r.url, aowner )
      const txfee = `${r.baseRelayFee}+${r.pctRelayFee}%` // + `\n${(curBlockNumber-e.blockNumber)}`
      relays[r.relayManager] = {
        addr: r.relayManager,
        worker: '',
        url: r.relayUrl,
        owner: aowner,
        txfee,
        status: { level: 'gray', value: 'waiting' }
      }
    })
    this.updateDisplay()

    // owner status not working.
    if (false) {
      Object.keys(owners).forEach(k => {
        web3.eth.getBalance(k)
          .then(bal => {
            owners[k].bal = bal / 1e18
            this.updateDisplay()
          })
        hub.methods.balanceOf(k).call()
          .then(bal => {
            owners[k].deposit = bal / 1e18
            this.updateDisplay()
          })
      })
    }
  }

  // call to reflect current state (relays, owners) in the UI
  updateDisplay() {
    const levels = { green: 1, gray: 2, orange: 2, red: 3, magenta: 4 }

    function byLevel(a, b) {
      return levels[a.status.level] - levels[b.status.level]
    }

    this.setState({
      relays: Object.values(this.state.relaysDict).sort(byLevel),
      owners: Object.values(this.state.ownersDict)
    })
  }

  constructor (props) {
    super(props)

    this.state = {
      relays: [],
      hubstate: {
        counts: {}
      }
    }
    const network = props.networks[this.props.network]
    this.state.network = network
    const httpProvider = new Web3.providers.HttpProvider(network.url)
    // let web3provider = new RelayProvider( httpProvider, {verbose:true} )
    const web3provider = httpProvider
    const web3 = new Web3(web3provider)
    this.web3 = web3

    this.relayHeaders = this.headers(['addr', 'worker', 'url', 'status', 'bal'])
    this.ownerHeaders = this.headers(['addr', 'name', 'deposit', 'bal'])
    globalevent.on('refresh', e => {
      this.updateRelays()
    })
    this.updateRelays()
  }

  // table columns with special renderers
  renderers = {
    addr: (val) => <Address addr={val} network={this.state.network} />,
    worker: (val) => <Address addr={val} network={this.state.network} />,
    bal: (val) => <> <Balance val={(val || [])[0]} /> <Balance val={(val || [])[1]} /> </>,
    deposit: (val) => <Balance val={val} />,
    url: (val, row) => <><RelayUrl url={val} /><RelayStats mgr={row.addr} worker={row.worker}
      eventsInfo={this.eventsInfo} /></>,
    status: (val) => <Status status={val} />
  }

  headers(arr) {
    return arr.map(h => ({ title: h, dataIndex: h, render: this.renderers[h] }))
  }

  render() {
    // just to avoid "xDai xDai" (a group with a single network)
    const netName = ({ name, group }) => `${group} ${name}`.replace(RegExp(`\\b${group}\\s+${group}\\b`), group)
    return (<>
      <Card> <Card.Body>

        {/* eslint-disable-next-line */}
        <a name={this.props.network}></a>
        <h3>Network: {netName(this.state.network)}</h3>
        RelayHub: <Address addr={this.state.network.RelayHub} network={this.state.network} />
        <HubStatus net={this.state.network.name}
          countsPerDay={sparklineData(this.eventsInfo)} ver={this.state.hubstate.version}
          counts={this.state.hubstate.counts}
          stakeTokenInfos={this.state.stakeTokenInfos || []}
          pctRelayFee={this.state.hubstate.pctRelayFee}
          baseRelayFee={this.state.hubstate.baseRelayFee}
          unstakedelayDays={this.state.hubstate.unstakedelayDays} />
        <br />
        Relays:
        {/* {this.state.relays.map(relay=><RelayInfo relay={relay} network={this.state.network} />)} */}
        <MyTable striped data={this.state.relays} columns={this.relayHeaders} />

        {this.props.showOwners && <>
          Owners:
          <MyTable data={this.state.owners} columns={this.ownerHeaders} />
        </>}

      </Card.Body></Card> <br /> </>
    )
  }
}

const Status = ({ status }) => <font color={status.level}>{status.value}</font>

function MyHeaderCol({ header }) {
  return header.title || header.id
}

function MyDataCol({ val, row, header }) {
  if (header.render) { return header.render(val, row) }
  return val || header.nullValue || ''
}

function MyTable({
  columns,
  data,
  hideHeader,
  ...htmlprops
}) {
  return <Table {...htmlprops}>
    {(!hideHeader) && <thead>
      <tr>
        {columns.map((h, j) => <th key={j}><MyHeaderCol header={h} /></th>)}
      </tr>
    </thead>}
    <tbody>
      {data && data.map((row, i) => <tr key={i}>
        {columns.map((h, j) => <td key={j}><MyDataCol val={row[h.id || h.dataIndex]} row={row} header={h} /></td>)}
      </tr>)}
    </tbody>

  </Table>
}

class RelaysList extends React.Component {
  constructor (props) {
    super(props)
    this.state = { showAll: true, goToManage: false }
    // cookie.load('app')
  }

  componentDidMount() {
    // default title set in index.html
    document.title = "GSN (v3) Relays Network"

    getNetworks().then(networks => {
      this.setState({ networks })
    }).catch(e => {
      console.log('failed getNetworks', e)
      this.setState({ error: e.message })
    })
  }

  toggle(item) {
    const change = {}
    change[item] = !this.state[item]
    this.setState(change)
  }

  componentDidUpdate() {
    // cookie.save('app', this.state)
  }

  render() {
    let onlyNet
    const m = window.location.href.match(/#.*only=([,\w]+)/)
    if (m != null) {
      onlyNet = m[1].split(/,/)
    }

    if (!this.state.networks) {
      return <>
        Loading...
        {this.state.error && <div>{this.state.error}</div>}
      </>
    }
    return <>
      {this.state.goToManage ? <Navigate to='/manage' /> : null}
      <Card.Body>
        <h2>&nbsp;<img src="favicon.ico" height="50px" alt="" /> GSN (v3 beta) Relay Servers</h2>
        <b>Note</b> This is the status page of the new v3 (beta). For the current v2 network see <a
          href="https://relays-v2.opengsn.org">here</a>
        <hr />
        <NetworkLinks networks={this.state.networks} relayCounts={relayCounts} />
        <ButtonGroup vertical>
          <button className="my-2" onClick={() => this.setState({ goToManage: true })}>Add new</button>
          <button className="my-2" onClick={() => globalevent.emit('refresh')}>Refresh</button>
        </ButtonGroup>

        {false && <>
          <ButtonGroup>
            <Form.Check type="checkbox" label="all networks" checked={this.state.showAll}
              onChange={() => this.toggle('showAll')} />
            &nbsp;&nbsp;&nbsp;
            <Form.Check type="checkbox" label="show owners" checked={this.state.showOwners}
              onChange={() => this.toggle('showOwners')} />
          </ButtonGroup>
        </>}
        {
          Object.keys(this.state.networks)
            .filter(net => this.state.showAll ? true : net === 'mainnet')
            .filter(net => onlyNet === undefined || onlyNet.includes(net))
            .map(net => <GsnStatus key={net} networks={this.state.networks} network={net}
              showOwners={this.state.showOwners} />)}
        <button onClick={() => globalevent.emit('refresh')}>Refresh</button>

      </Card.Body></>
  }
}

export default RelaysList
