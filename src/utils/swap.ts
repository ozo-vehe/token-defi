import { ethers } from "ethers";
import FACTORY_ABI from "../abis/factory.json";
import SWAP_ROUTER_ABI from "../abis/swaprouter.json";
import POOL_ABI from "../abis/pool.json";
import TOKEN_IN_ABI from "../abis/token.json";

const SWAP_ROUTER_CONTRACT_ADDRESS = "0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E";
const LINK_TOKEN_ADDRESS = "0xf8fb3713d459d7c1018bd0a49d19b4c44290ebe5";
const USDC_TOKEN_ADDRESS = "0x94a9d9ac8a22534e3faca9f4e7f2e2cf85d5e4c8";
const POOL_FACTORY_CONTRACT_ADDRESS = "0x0227628f3F023bb0B980b67D528571c95c6DaC1c";

async function approveToken(tokenAddress: string, tokenABI: any, amount: string | number, wallet: any) {
  try {
    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, wallet);
    const approveAmount = ethers.parseUnits(amount.toString(), 6);
    const approveTransaction = await tokenContract.approve.populateTransaction(
      SWAP_ROUTER_CONTRACT_ADDRESS,
      approveAmount
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
    // return receipt.hash;
  } catch (error) {
    console.error("An error occurred during token approval:", error);
    throw new Error("Token approval failed");
  }
}

//Part C - Write Get Pool Info Function
async function getPoolInfo(factoryContract:any, tokenInAddress: string, tokenOutAddress: string, provider: any) {
  const poolAddress = await factoryContract.getPool(
    tokenInAddress,
    tokenOutAddress,
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
async function prepareSwapParams(poolContract: any, signer: any, amountIn: BigInt, tokenInAddress: string, tokenOutAddress: string) {
  return {
    tokenIn: tokenInAddress,
    tokenOut: tokenOutAddress,
    fee: await poolContract.fee(),
    recipient: signer.address,
    amountIn: amountIn,
    amountOutMinimum: 0,
    sqrtPriceLimitX96: 0,
  };
}

//Part E - Write Execute Swap Function
async function executeSwap(swapRouter: any, params: Object, signer: any) {
  const transaction = await swapRouter.exactInputSingle.populateTransaction(
    params
  );
  const receipt = await signer.sendTransaction(transaction);
  console.log(`-------------------------------`);
  console.log(`Receipt: https://sepolia.etherscan.io/tx/${receipt.hash}`);
  console.log(`-------------------------------`);
  return receipt.hash;
}

//Part F - Write Main Function
export const swap = async(swapAmount: string | number, signer: any, provider: any) => {
  const inputAmount = swapAmount;
  const amountIn = ethers.parseUnits(inputAmount.toString(), 6);
  
  const factoryContract = new ethers.Contract(
    POOL_FACTORY_CONTRACT_ADDRESS,
    FACTORY_ABI,
    signer
  )

  try {
    await approveToken(USDC_TOKEN_ADDRESS, TOKEN_IN_ABI, inputAmount, signer);

    const { poolContract } = await getPoolInfo(factoryContract, USDC_TOKEN_ADDRESS, LINK_TOKEN_ADDRESS, provider);

    const params = await prepareSwapParams(poolContract, signer, amountIn, USDC_TOKEN_ADDRESS, LINK_TOKEN_ADDRESS);

    const swapRouter = new ethers.Contract(
      SWAP_ROUTER_CONTRACT_ADDRESS,
      SWAP_ROUTER_ABI,
      signer
    );
    const txHash = await executeSwap(swapRouter, params, signer);
    return txHash;

  } catch (error: any) {
    console.error("An error occurred:", error.message);
  }
}