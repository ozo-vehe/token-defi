import { ethers } from "ethers";
import AAVE_POOL_ABI from "../abis/aavepool.json";
import ERC20_ABI from "../abis/erc20.json";
import {Token} from "./tokens";
import { getPoolAddress } from "./supply";

// Function to approve the Pool contract to withdraw token
async function approveTokenWithdraw(tokenAddress: string, tokenABI: any, amount: BigInt, signer: any, poolAddress: string) {
  try {
    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);

    // Directly call the approve method on the contract
    const approveTransaction = await tokenContract.approve(poolAddress, amount);

    console.log(`Sending Approval Transaction...`);
    const receipt = await approveTransaction.wait();
    console.log(`Approval Transaction Confirmed! https://sepolia.etherscan.io/tx/${receipt.hash}`);
  } catch (error) {
    console.error("An error occurred during token approval:", error);
    throw new Error("Token approval failed");
  }
}

// Function to deposit token into Aave
async function withdrawFromAave(tokenAddress: string, poolAddress: string, amount: BigInt, signer: any) {
  const aavePoolContract = new ethers.Contract(poolAddress, AAVE_POOL_ABI, signer);

  console.log(`Withdrawing ${amount.toString()} tokens from Aave...`);
  try {
    const depositTx = await aavePoolContract.withdraw(
      tokenAddress,
      amount,
      signer.address,
      { gasLimit: 300000 }
    );
    const receipt = await depositTx.wait();
    console.log(`Aave Withdrawal Confirmed: https://sepolia.etherscan.io/tx/${receipt.hash}`);
    return receipt.hash;
  } catch (error) {
    console.error("An error occurred during deposit to Aave:", error);
    throw new Error("Aave deposit failed");
  }
}

const withdrawToken = async (tokenAddress: string, tokenABI: any, tokenDecimal: number, amount: string, provider: any, signer: any) => {
  const amountIn = ethers.parseUnits(amount, tokenDecimal);
  try {
    // Get the Pool contract address from the PoolAddressesProvider
    const poolAddress = await getPoolAddress(provider);
    console.log("------------------------------------------------");
    console.log("Pool Address: ");
    console.log(poolAddress);
    console.log("------------------------------------------------");

    // Approve LINK for the Pool contract
    await approveTokenWithdraw(tokenAddress, tokenABI, amountIn, signer, poolAddress);

    // Deposit token into Aave
    const txHash = await withdrawFromAave(tokenAddress, poolAddress, amountIn, signer);

    return txHash;

    // Withdraw LINK from Aave
  } catch (error: any) {
    console.error("An error occurred:", error.message);
  }
}

// Main function
export const withdraw = async (amount: string, signer: any, provider: any, token: Token) => {
  if(Number(amount) < 1) {
    alert("No tokens available for withdrawwal...")
    return;
  }
  
  const txHash = await withdrawToken(token.address, ERC20_ABI, token.decimal, amount, provider, signer);
  return txHash;
}