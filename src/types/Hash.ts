export type HashType = `0x${string}`

export interface Hashes {
  funder?: HashType
  minter?: HashType
  approver?: HashType
  staker?: HashType
}
