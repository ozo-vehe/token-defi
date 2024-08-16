import { ethers } from "ethers";
import PoolAddressesProviderABI from "../abis/PoolAddressesProvider.json";
import LINK_TOKEN_ABI from "../abis/link.json";
import AAVE_POOL_ABI from "../abis/aavepool.json";
import TOKEN_IN_ABI from "../abis/token.json";

// Constants
const POOL_ADDRESSES_PROVIDER_ADDRESS = "0x012bAC54348C0E635dCAc9D5FB99f06F24136C9A";
const LINK_TOKEN_ADDRESS = "0xf8fb3713d459d7c1018bd0a49d19b4c44290ebe5";
const USDC_TOKEN_ADDRESS = "0x94a9d9ac8a22534e3faca9f4e7f2e2cf85d5e4c8";

// Amount to deposit and withdraw
// const amount = ethers.parseUnits("0.1", 18);

async function checkApproval(tokenAddress: string, tokenABI: any, poolAddress: string, signer: any,) {
  const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
  const allowance = await tokenContract.allowance(signer.address, poolAddress);
  console.log(`Current Allowance: ${ethers.formatUnits(allowance, 18)} LINK`);
  return allowance;
}

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
async function approveLinkToken(tokenAddress: string, tokenABI: any, amount: BigInt, signer: any, poolAddress: string) {
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
async function depositToAave(tokenAddress: string, poolAddress: string, amount: BigInt, signer: any) {
  const aavePoolContract = new ethers.Contract(poolAddress, AAVE_POOL_ABI, signer);

  console.log(`Depositing ${amount.toString()} LINK into Aave...`);
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
  try {
    // Get the Pool contract address from the PoolAddressesProvider
    const poolAddress = await getPoolAddress(provider);
    console.log("------------------------------------------------");
    console.log("Pool Address: ");
    console.log(poolAddress);
    console.log("------------------------------------------------");

    // Check balance and approval before proceeding
    await checkApproval(tokenAddress, tokenABI, poolAddress, signer);

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
export const supply = async (amount: string, signer: any, provider: any, token: string) => {
  const tokenDecimal: number = token == "USDC" ? 6 : 18;

  if (token == "USDC") {
    const txHash = await supplyToken(USDC_TOKEN_ADDRESS, TOKEN_IN_ABI, tokenDecimal, amount, provider, signer);
    return txHash;
  } else {
    const txHash = await supplyToken(LINK_TOKEN_ADDRESS, LINK_TOKEN_ABI, tokenDecimal, amount, provider, signer);
    return txHash;
  }
}