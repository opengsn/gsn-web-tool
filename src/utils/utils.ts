import { utils, BigNumber, BigNumberish } from 'ethers'

export const isSameAddress = (address1: string, address2: string): boolean => {
  return utils.getAddress(address1) === utils.getAddress(address2)
}

export const toNumber = (x: BigNumberish) => {
  return BigNumber.from(x).toNumber()
}

export async function sleep(ms: number): Promise<void> {
  return await new Promise((resolve) => setTimeout(resolve, ms))
}

// check if relayUrl
export const isLocalHost =
  ['localhost', '127.0.0.1', '::1', ''].includes(window.location.hostname) || window.location.hostname.endsWith('.localhost')

export const truncateFromMiddle = (fullStr: string = '', strLen: number, middleStr: string = '...') => {
  if (fullStr.length <= strLen) return fullStr
  const midLen = middleStr.length
  const charsToShow = strLen - midLen
  const frontChars = Math.ceil(charsToShow / 2)
  const backChars = Math.floor(charsToShow / 2)
  return fullStr.substr(0, frontChars) + middleStr + fullStr.substr(fullStr.length - backChars)
}

export async function copyTextToClipboard(text: string) {
  if ('clipboard' in navigator) {
    return await navigator.clipboard.writeText(text)
  } else {
    return document.execCommand('copy', true, text)
  }
}

export const formatMetaMaskError = (error: string) => {
  if (error.includes('cannot estimate gas')) {
    return 'Error: cannot estimate gas; transaction may fail or may require manual gas limit'
  }
  if (error.includes('[ethjs-query] while formatting outputs from RPC')) {
    const parsed = JSON.parse(error.substring(error.indexOf('{'), error.lastIndexOf('}') + 1))
    const errorMessage = error.substring(0, error.indexOf('{') - 1)
    const { code: dataCode, message: dataMessage } = parsed.value.data
    const output = `Error: ${errorMessage}\n Code: ${dataCode as string}\nMessage: ${dataMessage as string}`
    return output
  } else {
    return `Error: ${error}`
  }
}

export const formatNumber = (num: number, digits: number = 6) => {
  return parseFloat(num.toFixed(digits))
}

export const weiToGwei = (wei: number): number => {
  return wei / Math.pow(10, 9)
}
