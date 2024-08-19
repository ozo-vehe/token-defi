import { ethers } from "ethers";
import FACTORY_ABI from "../abis/factory.json";
import SWAP_ROUTER_ABI from "../abis/swaprouter.json";
import POOL_ABI from "../abis/pool.json";
import TOKEN_IN_ABI from "../abis/token.json";
import { Token } from "./tokens";
import { tokenBalance } from ".";

const POOL_FACTORY_CONTRACT_ADDRESS = "0x0227628f3F023bb0B980b67D528571c95c6DaC1c";
const SWAP_ROUTER_CONTRACT_ADDRESS = "0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E";

//Part B - Write Approve Token Function
const approveToken = async(tokenAddress: string, tokenABI: any, amount: bigint, wallet: any) => {
  try {
    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, wallet);
    // const approveAmount = ethers.parseUnits(amount.toString(), LINK.decimals);
    const approveTransaction = await tokenContract.approve.populateTransaction(
      SWAP_ROUTER_CONTRACT_ADDRESS,
      amount
    );
    const transactionResponse = await wallet.sendTransaction(
      approveTransaction
    );
    console.log(`-------------------------------`);
    console.log(`Sending Approval Transaction...`);
    console.log(`-------------------------------`);
    console.log(`Transaction Sent: ${transactionResponse.hash}`);
    console.log(`-------------------------------`);
    const receipt = await transactionResponse.wait();
    console.log(
      `Approval Transaction Confirmed! https://sepolia.etherscan.io/tx/${receipt.hash}`
    );
  } catch (error) {
    console.error("An error occurred during token approval:", error);
    throw new Error("Token approval failed");
  }
}

//Part C - Write Get Pool Info Function
const getPoolInfo = async(factoryContract: any, tokenIn: Token, tokenOut: Token, provider: any) => {
  const poolAddress = await factoryContract.getPool(
    tokenIn.address,
    tokenOut.address,
    3000
  );
  if (!poolAddress) {
    throw new Error("Failed to get pool address");
  }
  const poolContract = new ethers.Contract(poolAddress, POOL_ABI, provider);
  const [token0, token1, fee] = await Promise.all([
    poolContract.token0(),
    poolContract.token1(),
    poolContract.fee(),
  ]);
  return { poolContract, token0, token1, fee };
}

//Part D - Write Prepare Swap Params Function
const prepareSwapParams = async(poolContract: any, signer: any, amountIn: bigint, tokenIn: Token, tokenOut: Token) => {
  return {
    tokenIn: tokenIn.address,
    tokenOut: tokenOut.address,
    fee: await poolContract.fee(),
    recipient: signer.address,
    amountIn: amountIn,
    amountOutMinimum: 0,
    sqrtPriceLimitX96: 0,
  };
}

//Part E - Write Execute Swap Function
const executeSwap = async(swapRouter: any, params: any, signer: any) => {
  const transaction = await swapRouter.exactInputSingle.populateTransaction(
    params,
    {gasLimit: 300000}
  );
  try {
    const receipt = await signer.sendTransaction(transaction);
    console.log(`-------------------------------`);
    console.log(`Receipt: https://sepolia.etherscan.io/tx/${receipt.hash}`);
    console.log(`-------------------------------`);

    return receipt.hash;
  } catch (error) {
    throw new Error("Token swap failed");
  }
}

//Part F - Write Main Function
export const swap = async(swapAmount: string, tokenIn: Token, tokenOut: Token, signer: any, provider: any) => {
  const inputAmount = swapAmount;
  const amountIn = ethers.parseUnits(inputAmount.toString(), tokenIn.decimal);
  
  const getTokenBalance = await tokenBalance(tokenIn.address, TOKEN_IN_ABI, signer, tokenIn.decimal);

  if(Number(getTokenBalance) < 1) {
    alert("No tokens available to swap, please select another pair for swapping...");
    return;
  }

  const factoryContract = new ethers.Contract(
    POOL_FACTORY_CONTRACT_ADDRESS,
    FACTORY_ABI,
    provider
  );

  try {
    await approveToken(tokenIn.address, TOKEN_IN_ABI, amountIn, signer);
    const { poolContract } = await getPoolInfo(factoryContract, tokenIn, tokenOut, provider);
    const params = await prepareSwapParams(poolContract, signer, amountIn, tokenIn, tokenOut);

    const swapRouter = new ethers.Contract(
      SWAP_ROUTER_CONTRACT_ADDRESS,
      SWAP_ROUTER_ABI,
      signer
    );
    const txHash = await executeSwap(swapRouter, params, signer);

    return txHash;
  } catch (error: any) {
    console.error("An error occurred:", error.message);
    throw new Error("Token swap failed");
  }
}