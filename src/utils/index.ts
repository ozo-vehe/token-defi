import { ethers } from "ethers";
// import LINK_TOKEN_ABI from "../abis/link.json";
// import TOKEN_IN_ABI from "../abis/token.json";
// import AAVE_POOL_ABI from "../abis/aavepool.json";
import ERC20_ABI from "../abis/erc20.json";
// import { getPoolAddress } from "./supply";
import { aaveTokens, tokens, Token } from "./tokens";

export const tokenBalance = async (tokenAddress: string, tokenABI: any, signer: any, tokenDecimal: number) => {
  
  const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
  const tokenBalanceUnformatted = await tokenContract.balanceOf(signer.address);
  const balance = ethers.formatUnits(tokenBalanceUnformatted, tokenDecimal)

  return balance;
}

export const getBalance = async (signer: any) => {
  let availableTokens: Token[] = [];
  for(let token in tokens) {
    const balance = await tokenBalance(tokens[token].address, ERC20_ABI, signer, tokens[token].decimal);

    availableTokens.push({...tokens[token], balance});
  }

  return availableTokens
}

export const getPoolData = async (signer: any) => {
  let availableTokens: Token[] = [];
  for(let token in aaveTokens) {
    const balance = await tokenBalance(aaveTokens[token].address, ERC20_ABI, signer, aaveTokens[token].decimal);

    availableTokens.push({...aaveTokens[token], balance});
  }

  return availableTokens;
}

export const getTokensArr = async () => {
  let arr: Token[] = [];
  for(let _token in tokens) {
    const token = tokens[_token]
    arr.push(token);
  }
  return arr;
}

// export const reserveBalance = async(provider: any, signer: any, token: Token) => {
//   console.log("Reserve balance...");
//   const poolAddress = await getPoolAddress(provider)
//   const aavePoolContract = new ethers.Contract(poolAddress, AAVE_POOL_ABI, signer);

//   const reserveTokenBalance = await aavePoolContract.getReserveData(token.address);

//   console.log(reserveTokenBalance);
// }