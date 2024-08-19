import { ethers } from "ethers";
import PoolAddressesProviderABI from "../abis/PoolAddressesProvider.json";
import AAVE_POOL_ABI from "../abis/aavepool.json";
import TOKEN_IN_ABI from "../abis/token.json";
import { Token } from "./tokens";
import { tokenBalance } from ".";

// Constants
const POOL_ADDRESSES_PROVIDER_ADDRESS = "0x012bAC54348C0E635dCAc9D5FB99f06F24136C9A";

// Function to get the Pool contract address
export const getPoolAddress = async (provider: any) => {
  try {
    const poolAddressesProvider = new ethers.Contract(
      POOL_ADDRESSES_PROVIDER_ADDRESS,
      PoolAddressesProviderABI,
      provider
    );

    // Fetch the Pool contract address
    const poolAddress = await poolAddressesProvider.getPool();
    console.log(`Current Pool Address: ${poolAddress}`);

    return poolAddress;
  } catch (error) {
    console.error("An error occurred while fetching the Pool address:", error);
    throw new Error("Failed to fetch the Pool address");
  }
}

// Function to approve the Pool contract to spend LINK tokens
const approveLinkToken = async(tokenAddress: string, tokenABI: any, amount: BigInt, signer: any, poolAddress: string) => {
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
const depositToAave = async(tokenAddress: string, poolAddress: string, amount: BigInt, signer: any) => {
  const aavePoolContract = new ethers.Contract(poolAddress, AAVE_POOL_ABI, signer);

  console.log(`Depositing ${amount.toString()} token into Aave...`);
  try {
    const depositTx = await aavePoolContract.supply(
      tokenAddress,
      amount,
      signer.address,
      0, // referral code
      { gasLimit: 300000 }
    );
    const receipt = await depositTx.wait();
    console.log(`Aave Deposit Confirmed: https://sepolia.etherscan.io/tx/${receipt.hash}`);
    return receipt.hash;
  } catch (error) {
    console.error("An error occurred during deposit to Aave:", error);
    throw new Error("Aave deposit failed");
  }
}

const supplyToken = async (tokenAddress: string, tokenABI: any, tokenDecimal: number, amount: string, provider: any, signer: any) => {
  const amountIn = ethers.parseUnits(amount, tokenDecimal);
  const getTokenBalance = await tokenBalance(tokenAddress, TOKEN_IN_ABI, signer, tokenDecimal)

  console.log("Balance: ");
  console.log(getTokenBalance);

  if(Number(amount) > Number(getTokenBalance)) {
    alert("Invalid amount entered...");
    throw new Error("Invalid amount entered");
  }


  try {
    // Get the Pool contract address from the PoolAddressesProvider
    const poolAddress = await getPoolAddress(provider);
    console.log("------------------------------------------------");
    console.log("Pool Address: ");
    console.log(poolAddress);
    console.log("------------------------------------------------");

    // Approve LINK for the Pool contract
    await approveLinkToken(tokenAddress, tokenABI, amountIn, signer, poolAddress);

    // Deposit token into Aave
    const txHash = await depositToAave(tokenAddress, poolAddress, amountIn, signer);

    return txHash;

    // Withdraw LINK from Aave
  } catch (error: any) {
    console.error("An error occurred:", error.message);
  }
}

// Main function
export const supply = async (amount: string, signer: any, provider: any, token: Token) => {
  
  const txHash = await supplyToken(token.address, TOKEN_IN_ABI, token.decimal, amount, provider, signer);
  return txHash;
}