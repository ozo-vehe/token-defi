import { ethers } from "ethers";
import LINK_TOKEN_ABI from "../abis/link.json";
import TOKEN_IN_ABI from "../abis/token.json";
import AAVE_POOL_ABI from "../abis/aavepool.json";
import ERC20_ABI from "../abis/erc20.json";
import { getPoolAddress } from "./supply";

interface Token {
  id: string | undefined;
  name: string | undefined;
  balance: string | undefined;
  symbol: string | undefined;
}

const LINK_TOKEN_ADDRESS = "0xf8fb3713d459d7c1018bd0a49d19b4c44290ebe5";
const USDC_TOKEN_ADDRESS = "0x94a9d9ac8a22534e3faca9f4e7f2e2cf85d5e4c8";

const aETH_USDC_TOKEN_ADDRESS = "0x16dA4541aD1807f4443d92D26044C1147406EB80";
const aETH_LINK_TOKEN_ADDRESS = "0x3FfAf50D4F4E96eB78f2407c090b72e86eCaed24";

export const getBalance = async (signer: any) => {
  const linkContract = new ethers.Contract(LINK_TOKEN_ADDRESS, LINK_TOKEN_ABI, signer);
  const linkBalanceUnformatted = await linkContract.balanceOf(signer?.address);
  const link = ethers.formatUnits(linkBalanceUnformatted, 18)

  const usdcContract = new ethers.Contract(USDC_TOKEN_ADDRESS, TOKEN_IN_ABI, signer);
  const usdcBalanceUnformatted = await usdcContract.balanceOf(signer?.address);
  const usdc = ethers.formatUnits(usdcBalanceUnformatted, 6)

  // console.log(`LINK Balance: ${ethers.utils.formatUnits(balance, 18)} LINK`);
  return { link, usdc };
}

export const getPoolData = async (signer: any, provider: any) => {
  const poolAddress = await getPoolAddress(provider);
  // const poolContract = new ethers.Contract(poolAddress, AAVE_POOL_ABI, signer);

  const aEthUsdcContract = new ethers.Contract(aETH_USDC_TOKEN_ADDRESS, ERC20_ABI, signer);
  const aEthLinkContract = new ethers.Contract(aETH_LINK_TOKEN_ADDRESS, ERC20_ABI, signer);

  const linkBalance = await aEthLinkContract.balanceOf(signer.address);
  const usdcBalance = await aEthUsdcContract.balanceOf(signer.address);

  console.log(`Link Balance: ${ethers.formatUnits(linkBalance, 18)} LINK`);
  console.log(`USDC Balance: ${ethers.formatUnits(usdcBalance, 6)} USDC`);

  // const tx = await poolContract.getUserAccountData(signer.address);
  // const { totalCollateralETH, totalBorrowsETH, availableBorrowsETH, currentLiquidationThreshold, ltv, healthFactor } = tx;
  // console.log(tx);
  const aEthLink: Token = {
    id: "1",
    name: "Aaev Ethereum LINK",
    balance: ethers.formatUnits(linkBalance, 18),
    symbol: "aEthLINK"
  }
  const aEthUsdc: Token = {
    id: "2",
    name: "Aaev Ethereum USDC",
    balance: ethers.formatUnits(usdcBalance, 6),
    symbol: "aEthUSDC"
  }
  return [aEthLink, aEthUsdc];
}