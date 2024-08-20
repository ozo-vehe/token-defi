import { ethers } from "ethers";
import PoolAddressesProviderABI from "../abis/PoolAddressesProvider.json";
import AAVE_POOL_ABI from "../abis/aavepool.json";
import TOKEN_IN_ABI from "../abis/token.json";
import { Token } from "./tokens";
import { tokenBalance } from ".";

// Constants
const POOL_ADDRESSES_PROVIDER_ADDRESS = "0x012bAC54348C0E635dCAc9D5FB99f06F24136C9A"; // Address of the PoolAddressesProvider contract

// Function to get the Pool contract address
export const getPoolAddress = async (provider: any) => {
  try {
    // Create a new contract instance for the PoolAddressesProvider
    const poolAddressesProvider = new ethers.Contract(
      POOL_ADDRESSES_PROVIDER_ADDRESS,
      PoolAddressesProviderABI,
      provider
    );

    // Fetch the current Pool contract address
    const poolAddress = await poolAddressesProvider.getPool();
    console.log(`Current Pool Address: ${poolAddress}`);

    return poolAddress; // Return the Pool contract address
  } catch (error) {
    console.error("An error occurred while fetching the Pool address:", error);
    throw new Error("Failed to fetch the Pool address"); // Throw an error if the Pool address fetch fails
  }
}

// Function to approve the Pool contract to spend a specified amount of LINK tokens
const approveLinkToken = async (
  tokenAddress: string, // The address of the token (e.g., LINK)
  tokenABI: any,        // The ABI of the token contract (ERC20 standard)
  amount: BigInt,       // The amount of tokens to approve for spending
  signer: any,          // The signer object to sign the transaction (connected wallet)
  poolAddress: string   // The address of the Aave Pool contract
) => {
  try {
    // Create a new contract instance for the token using the provided token address, ABI, and signer
    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);

    // Call the approve function on the token contract to allow the Pool contract to spend the specified amount
    const approveTransaction = await tokenContract.approve(poolAddress, amount);

    console.log(`Sending Approval Transaction...`);
    // Wait for the transaction to be confirmed
    const receipt = await approveTransaction.wait();
    console.log(`Approval Transaction Confirmed! https://sepolia.etherscan.io/tx/${receipt.hash}`);
  } catch (error) {
    console.error("An error occurred during token approval:", error);
    throw new Error("Token approval failed"); // Throw an error if the approval fails
  }
}

// Function to deposit tokens into Aave's Pool contract
const depositToAave = async (
  tokenAddress: string, // The address of the token to deposit (e.g., LINK)
  poolAddress: string,  // The address of the Aave Pool contract
  amount: BigInt,       // The amount of tokens to deposit
  signer: any           // The signer object to sign the transaction (connected wallet)
) => {
  // Create a new contract instance for the Aave Pool contract
  const aavePoolContract = new ethers.Contract(poolAddress, AAVE_POOL_ABI, signer);

  console.log(`Depositing ${amount.toString()} token into Aave...`);
  try {
    // Call the supply function on the Aave Pool contract to deposit the tokens
    const depositTx = await aavePoolContract.supply(
      tokenAddress,       // The token to deposit
      amount,             // The amount to deposit
      signer.address,     // The address of the user (deposit sender)
      0,                  // Referral code (0 means no referral)
      { gasLimit: 300000 } // Optional gas limit for the transaction
    );
    // Wait for the transaction to be confirmed
    const receipt = await depositTx.wait();
    console.log(`Aave Deposit Confirmed: https://sepolia.etherscan.io/tx/${receipt.hash}`);
    return receipt.hash; // Return the transaction hash of the deposit
  } catch (error) {
    console.error("An error occurred during deposit to Aave:", error);
    throw new Error("Aave deposit failed"); // Throw an error if the deposit fails
  }
}

// Function to handle the token supply process
const supplyToken = async (
  tokenAddress: string,  // The address of the token to supply
  tokenABI: any,         // The ABI of the token contract (ERC20 standard)
  tokenDecimal: number,  // The number of decimals the token uses
  amount: string,        // The amount of tokens to supply as a string
  provider: any,         // The provider object for connecting to the blockchain
  signer: any           // The signer object to sign the transaction (connected wallet)
) => {
  // Parse the amount string to a BigInt based on the token's decimals
  const amountIn = ethers.parseUnits(amount, tokenDecimal);

  // Get the current balance of the token in the user's wallet
  const getTokenBalance = await tokenBalance(tokenAddress, TOKEN_IN_ABI, signer, tokenDecimal)

  console.log("Balance: ");
  console.log(getTokenBalance);

  // Check if the user has enough tokens to supply, if not, alert and throw an error
  if (Number(amount) > Number(getTokenBalance)) {
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

    // Approve the Aave Pool contract to spend the specified amount of LINK tokens
    await approveLinkToken(tokenAddress, tokenABI, amountIn, signer, poolAddress);

    // Deposit the tokens into Aave's Pool contract
    const txHash = await depositToAave(tokenAddress, poolAddress, amountIn, signer);

    return txHash; // Return the transaction hash of the deposit
  } catch (error: any) {
    console.error("An error occurred:", error.message); // Log any errors that occur during the supply process
  }
}

// Main function to initiate the token supply process
export const supply = async (
  amount: string, // The amount of tokens to supply as a string
  signer: any,    // The signer object to sign the transaction (connected wallet)
  provider: any,  // The provider object for connecting to the blockchain
  token: Token    // The token object containing the token's address, decimals, etc.
) => {
  // Call the supplyToken function to handle the token supply process
  const txHash = await supplyToken(token.address, TOKEN_IN_ABI, token.decimal, amount, provider, signer);
  return txHash; // Return the transaction hash of the supply
}
