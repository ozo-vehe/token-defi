export interface Token {
  name: string;
  symbol: string;
  address: string;
  decimal: number;
  balance: string
}

// Tokens
export const tokens: any = {
  chainlinkToken: {
    name: "ChainLink",
    symbol: "LINK",
    address: "0xf8fb3713d459d7c1018bd0a49d19b4c44290ebe5",
    decimal: 18,
    balance: 0,
  },
  usdcToken: {
    name: "USDC",
    symbol: "USDC",
    address: "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8",
    decimal: 6,
    balance: 0,
  },
  daiToken: {
    name: "DAI",
    symbol: "DAI",
    address: "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357",
    decimal: 18,
    balance: 0,
  },
  wEthToken: {
    name: "Wrapped Etheruem",
    symbol: "WETH",
    address: "0xC558DBdd856501FCd9aaF1E62eae57A9F0629a3c",
    decimal: 18,
    balance: 0,
  },
}

// Aave Tokens
export const aaveTokens: any = {
  aaveEthLINK: {
    name: "Aave Ethereum Chainlink",
    symbol: "aEthLINK",
    address: "0x3FfAf50D4F4E96eB78f2407c090b72e86eCaed24",
    decimal: 18,
    balance: 0,
  },
  aaveEthUSDC: {
    name: "Aave USDC",
    symbol: "aEthUSDC",
    address: "0x16dA4541aD1807f4443d92D26044C1147406EB80",
    decimal: 6,
    balance: 0,
  },
  aaveDAI: {
    name: "Aave DAI",
    symbol: "aEthDAI",
    address: "0x29598b72eb5CeBd806C5dCD549490FdA35B13cD8",
    decimal: 18,
    balance: 0,
  },
  aaveEthWETH: {
    name: "Aave Wrapped Etheruem",
    symbol: "aEthWETH",
    address: "0x5b071b590a59395fE4025A0Ccc1FcC931AAc1830",
    decimal: 18,
    balance: 0,
  },
};