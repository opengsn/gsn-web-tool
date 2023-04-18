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
