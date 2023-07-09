/** @type import('hardhat/config').HardhatUserConfig */

const chainId = process.env.CHAINID == null ? 1337 : parseInt(process.env.CHAINID)

module.exports = {
  solidity: '0.8.9',
  networks: {
    hardhat: { chainId }
  }
}
