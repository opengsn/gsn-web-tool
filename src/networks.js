//use #infura=xxxx, or default one.
const infura = (document.location.href.match(/#.*infura=([^&]*)/) || [])[1] || 'f40be2b1a3914db682491dc62a19ad43'
// '127b8c9f6d0d46f69a42963b5cd0d0ac'

//NOTE: this file is loaded dynamically (using eval) by the app. thus just updating it is enough instead of re-build entire react app
export const networks = {

    mainnet220: {
        group: "Ethereum",
        id: 1,
        name: "Mainnet",
        token: 'ETH',
        url: "https://mainnet.infura.io/v3/" + infura,
        etherscan: "https://etherscan.io/search?q=",
        RelayHub: "0x9e59Ea5333cD4f402dAc320a04fafA023fe3810D",
    },
    rinkeby220: {
        group: "Ethereum",
        id: 4,
        name: "Rinkeby",
        token: 'rinkEth',
        url: "https://rinkeby.infura.io/v3/" + infura,
        etherscan: "https://rinkeby.etherscan.io/search?q=",
        RelayHub: "0x6650d69225CA31049DB7Bd210aE4671c0B1ca132",
    },
    ropsten220: {
        group: "Ethereum",
        id: 3,
        name: "Ropsten",
        token: 'ropsEth',
        url: "https://ropsten.infura.io/v3/" + infura,
        etherscan: "https://ropsten.etherscan.io/search?q=",
        RelayHub: "0xA703037bCaF8A31a466BD28A260ac646A083361a", //2.2.0, apr
        RelayHub: '0xa703037bcaf8a31a466bd28a260ac646a083361a', //2.2.3, jul
    },
    kovan: {
        group: "Ethereum",
        id: 42,
        name: "Kovan",
        token: 'kovEth',
        url: "https://kovan.infura.io/v3/" + infura,
        etherscan: "https://kovan.etherscan.io/search?q=",
        RelayHub: "0x727862794bdaa3b8Bc4E3705950D4e9397E3bAfd",
    },

/*
    kotti: {
        group: "Ethereum Classic",
        name: "Kotti",
        token: 'kETC',
        RelayHub: "0xAdB0B519873860F396F8d6642286C179A5A0770D",
        url: "https://kotti.connect.bloq.cloud/v1/roast-blossom-sentence",
        etherscan: "https://blockscout.com/etc/kotti/address/"
    },

    etc: {
        group: "Ethereum Classic",
        name: "Mainnet",
        token: 'ETC',
        RelayHub: "0xDC8B38D05Be14818EE6d1cc4E5245Df6C52A684E",
        url: "https://etc.connect.bloq.cloud/v1/roast-blossom-sentence",
        etherscan: "https://blockscout.com/etc/mainnet/address/"
    },

*/
    maticMainnet: {
        group: "Polygon / Matic",
        name: "Mainnet",
        token: 'Matic',
        //url: "https://matic-mainnet.chainstacklabs.com",
        url: "https://polygon-mainnet.infura.io/v3/2461e2a5b1914b508c16cdb31d0225bf",
        fromBlock: "0xba9389",
        etherscan: "https://explorer-mainnet.maticvigil.com/address/",
        RelayHub: "0x6C28AfC105e65782D9Ea6F2cA68df84C9e7d750d",
        lookupWindow: 1000
    },

    maticMumbai: {
        group: "Polygon / Matic",
        name: "Matic Mumbai",
        token: 'Matic',
        url: "https://matic-testnet-archive-rpc.bwarelabs.com",
        fromBlock: "0xba9389",
        etherscan: "https://explorer-mumbai.maticvigil.com/address/",
        RelayHub: "0x6646cD15d33cE3a6933e36de38990121e8ba2806",
    },

    optMain: {
        group: "Optimism",
        name: "Mainnet",
        token: 'oETH',
        url: "https://optimism-mainnet.infura.io/v3/" + infura,
        fromBlock: "1245868",
        etherscan: "https://optimistic.etherscan.io/address/",
        RelayHub: "0x6f00F1A7BdB7E2E407385263B239090bCdb6b442",
    },

    optKovan: {
        group: "Optimism",
        name: "Kovan Testnet",
        token: 'oETH',
        url: "https://kovan.optimism.io/",
        fromBlock: "1318966",
        etherscan: "https://kovan-optimistic.etherscan.io/address/",
        RelayHub: "0xceEd6F194C07EB606ae0F3899DdfA7dE8a4ABcB5",
    },

    bsc: {
        group: "Binance",
        name: "Smart Chain",
        token: 'BNB',
        url: "https://bsc-dataseed.binance.org/",
        url: "https://bsc-dataseed1.ninicoin.io/",
        etherscan: "https://bscscan.com/address/",
        RelayHub: "0xAa3E82b4c4093b4bA13Cb5714382C99ADBf750cA",
        lookupWindow: 4990
    },

    testbsc: {
        group: "Binance",
        name: "Testnet",
        token: 'tBNB',
        url: "https://data-seed-prebsc-1-s1.binance.org:8545",
        etherscan: "https://testnet.bscscan.com/address/",
        RelayHub: "0xAa3E82b4c4093b4bA13Cb5714382C99ADBf750cA",
        lookupWindow: 4990
    },

    avax: {
        group: "Avalanche",
        name: "Mainnet",
        token: '',
        url: "https://api.avax.network/ext/bc/C/rpc",
        url: "https://rpc.ankr.com/avalanche",
        fromBlock: "12161392",
        etherscan: "https://snowtrace.io/address/",
        RelayHub: "0xafAFDac90164e4b2D4e39a1ac3e9dBC635dbbEA5",
    },
    fuji: {
        group: "Avalanche",
        name: "Testnet (Fuji)",
        token: '',
        url: "https://api.avax-test.network/ext/bc/C/rpc",
        fromBlock: 7857071,
        etherscan: "https://testnet.snowtrace.io/address/",
        RelayHub: "0x0321ABDba4dCf3f3AeCf463Def8F866568BC5174",
        lookupWindow: 10000,
        etherscanApi: 'https://api-testnet.snowtrace.io/api?'
    },

    xdai: {
        group: "xDAI",
        name: "xDAI",
        token: 'DAI',
        url: "https://dai.poa.network",
        etherscan: "https://blockscout.com/poa/xdai/address/",
        RelayHub: "0x727862794bdaa3b8Bc4E3705950D4e9397E3bAfd",
    },



}

// eslint-disable-next-line
let otherNetworks = {
    local: {
        name: "Local (Ganache)",
        url: "http://127.0.0.1:8545",
        etherscan: ""
    },
}

