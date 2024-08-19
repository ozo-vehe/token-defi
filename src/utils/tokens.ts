export interface Token {
  name: string;
  symbol: string;
  address: string;
  decimal: number;
  balance: string;
  chainId: number;
  isToken: boolean;
  isNative: boolean;
  wrapped: boolean;
}

// Tokens
export const tokens: any = {
  chainlinkToken: {
    name: "Chainlink",
    symbol: "LINK",
    address: "0xf8fb3713d459d7c1018bd0a49d19b4c44290ebe5",
    decimal: 18,
    balance: 0,
    chainId: 11155111,
    isToken: true,
    isNative: true,
    wrapped: false,
  },
  usdcToken: {
    name: "USDC",
    symbol: "USDC",
    address: "0x94a9d9ac8a22534e3faca9f4e7f2e2cf85d5e4c8",
    decimal: 6,
    balance: 0,
    chainId: 11155111,
    isToken: true,
    isNative: true,
    wrapped: false,
  },
  // daiToken: {
  //   name: "DAI",
  //   symbol: "DAI",
  //   address: "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357",
  //   decimal: 18,
  //   balance: 0,
  //   chainId: 11155111,
  //   isToken: true,
  //   isNative: true,
  //   wrapped: false,
  // },
}

// Aave Tokens
export const aaveTokens: any = {
  aaveEthLINK: {
    name: "Aave Ethereum Chainlink",
    symbol: "aEthLINK",
    address: "0x3FfAf50D4F4E96eB78f2407c090b72e86eCaed24",
    decimal: 18,
    balance: 0,
    chainId: 11155111,
    isToken: true,
    isNative: true,
    wrapped: false,
  },
  aaveEthUSDC: {
    name: "Aave USDC",
    symbol: "aEthUSDC",
    address: "0x16dA4541aD1807f4443d92D26044C1147406EB80",
    decimal: 6,
    balance: 0,
    chainId: 11155111,
    isToken: true,
    isNative: true,
    wrapped: false,
  },
  // aaveDAI: {
  //   name: "Aave DAI",
  //   symbol: "aEthDAI",
  //   address: "0x29598b72eb5CeBd806C5dCD549490FdA35B13cD8",
  //   decimal: 18,
  //   balance: 0,
  //   chainId: 11155111,
  //   isToken: true,
  //   isNative: true,
  //   wrapped: false,
  // },
};