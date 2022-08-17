/* eslint-disable */
import React from 'react'

function RelayCounts({ counts, net }) {
  if (!counts || !counts[net]) return <></>
  return <>({counts[net]})</>
}

/**
 * create a table of links to various networks
 * the networks array is keyed by network unique ID (which we use as anchor)
 * we group networks based on net.group (ethereum, classic, binance, etc)
 * within each group, the "mainnet" is the first.
 */
export class NetworkLinks extends React.Component {
  updateCount = 5

  //ugly update: global relayCounts is updated, and we want to refresh display
  // when it does..
  // (this component is rendered once, from the <App> object)
  updateCountsState() {
    this.setState({ relayCounts: this.props.relayCounts })
    if (this.updateCount-- > 0) {
      setTimeout(this.updateCountsState.bind(this), 2000)
    }
  }

  componentDidMount() {
    setTimeout(this.updateCountsState.bind(this), 1000)
  }

  render() {
    const networks = this.props.networks
    let networkArray = Object.values(networks);
    const netGroups = networkArray.map(n => n.group).reduce((set, g) => ({
      ...set,
      [g]: Object.keys(networks).filter(net => networks[net].group === g)
    }), {})

    return <table><tbody>
      {Object.keys(netGroups).map(g => <tr key={g}>
        <td>{g}:</td>
        <td>
          {netGroups[g].map((net, index) => {
            return <span key={index}> {index > 0 ? ", " : ""}<a href={"#" + net}>{networks[net].name}</a> <RelayCounts counts={this.props.relayCounts} net={net} /> </span>
          })}
        </td>
      </tr>)}
    </tbody></table>
  }
}
