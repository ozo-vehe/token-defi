import { ethers } from "ethers";
import AAVE_POOL_ABI from "../abis/aavepool.json";
import ERC20_ABI from "../abis/erc20.json";
import { Token } from "./tokens";
import { getPoolAddress } from "./supply";

// Function to approve the Pool contract to withdraw a specified amount of tokens
async function approveTokenWithdraw(
  tokenAddress: string,  // The address of the token contract (e.g., LINK)
  tokenABI: any,         // The ABI of the token contract (ERC20 standard)
  amount: BigInt,        // The amount of tokens to approve for withdrawal
  signer: any,           // The signer object to sign the transaction (connected wallet)
  poolAddress: string    // The address of the Aave Pool contract
) {
  try {
    // Create a new contract instance for the token using the provided token address, ABI, and signer
    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);

    // Call the approve function on the token contract to allow the Pool contract to withdraw the specified amount
    const approveTransaction = await tokenContract.approve(poolAddress, amount);

    console.log(`Sending Approval Transaction...`);
    // Wait for the transaction to be confirmed
    const receipt = await approveTransaction.wait();
    console.log(`Approval Transaction Confirmed! https://sepolia.etherscan.io/tx/${receipt.hash}`);
  } catch (error) {
    console.error("An error occurred during token approval:", error);
    // Throw an error if the approval fails
    throw new Error("Token approval failed");
  }
}

// Function to withdraw tokens from Aave's Pool contract
async function withdrawFromAave(
  tokenAddress: string,  // The address of the token to withdraw (e.g., LINK)
  poolAddress: string,   // The address of the Aave Pool contract
  amount: BigInt,        // The amount of tokens to withdraw
  signer: any            // The signer object to sign the transaction (connected wallet)
) {
  // Create a new contract instance for the Aave Pool contract
  const aavePoolContract = new ethers.Contract(poolAddress, AAVE_POOL_ABI, signer);

  console.log(`Withdrawing ${amount.toString()} tokens from Aave...`);
  try {
    // Call the withdraw function on the Aave Pool contract
    const depositTx = await aavePoolContract.withdraw(
      tokenAddress,      // The token to withdraw
      amount,            // The amount to withdraw
      signer.address,    // The address of the user (withdrawal recipient)
      { gasLimit: 300000 } // Optional gas limit for the transaction
    );
    // Wait for the transaction to be confirmed
    const receipt = await depositTx.wait();
    console.log(`Aave Withdrawal Confirmed: https://sepolia.etherscan.io/tx/${receipt.hash}`);
    return receipt.hash; // Return the transaction hash of the withdrawal
  } catch (error) {
    console.error("An error occurred during withdrawal from Aave:", error);
    // Throw an error if the withdrawal fails
    throw new Error("Aave withdrawal failed");
  }
}

// Function to handle the token withdrawal process
const withdrawToken = async (
  tokenAddress: string,   // The address of the token to withdraw
  tokenABI: any,          // The ABI of the token contract (ERC20 standard)
  tokenDecimal: number,   // The number of decimals the token uses
  amount: string,         // The amount of tokens to withdraw as a string
  provider: any,          // The provider object for connecting to the blockchain
  signer: any             // The signer object to sign the transaction (connected wallet)
) => {
  // Parse the amount string to a BigInt based on the token's decimals
  const amountIn = ethers.parseUnits(amount, tokenDecimal);
  try {
    // Get the Pool contract address from the PoolAddressesProvider contract
    const poolAddress = await getPoolAddress(provider);
    console.log("------------------------------------------------");
    console.log("Pool Address: ");
    console.log(poolAddress);
    console.log("------------------------------------------------");

    // Approve the Aave Pool contract to withdraw the specified amount of tokens
    await approveTokenWithdraw(tokenAddress, tokenABI, amountIn, signer, poolAddress);

    // Withdraw the tokens from the Aave Pool contract
    const txHash = await withdrawFromAave(tokenAddress, poolAddress, amountIn, signer);

    return txHash; // Return the transaction hash of the withdrawal
  } catch (error: any) {
    console.error("An error occurred:", error.message); // Log any errors that occur during the withdrawal process
  }
}

// Main function to initiate the withdrawal process
export const withdraw = async (
  amount: string, // The amount of tokens to withdraw as a string
  signer: any,    // The signer object to sign the transaction (connected wallet)
  provider: any,  // The provider object for connecting to the blockchain
  token: Token    // The token object containing the token's address, decimals, etc.
) => {
  // Check if the amount to withdraw is less than 1, and if so, alert the user and return
  if (Number(amount) < 1) {
    alert("No tokens available for withdrawal...");
    return;
  }

  // Call the withdrawToken function to handle the withdrawal process
  const txHash = await withdrawToken(token.address, ERC20_ABI, token.decimal, amount, provider, signer);
  return txHash; // Return the transaction hash of the withdrawal
}
