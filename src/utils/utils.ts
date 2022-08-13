import { utils, BigNumber, BigNumberish } from 'ethers'

export const isSameAddress = (address1: string, address2: string): boolean => {
  return utils.getAddress(address1) === utils.getAddress(address2)
}

export const toNumber = (x: BigNumberish) => {
  return BigNumber.from(x).toNumber()
}

export async function sleep (ms: number): Promise<void> {
  return await new Promise(resolve => setTimeout(resolve, ms))
}
