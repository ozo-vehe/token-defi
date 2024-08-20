import { ethers } from "ethers";
import FACTORY_ABI from "../abis/factory.json";
import SWAP_ROUTER_ABI from "../abis/swaprouter.json";
import POOL_ABI from "../abis/pool.json";
import TOKEN_IN_ABI from "../abis/token.json";
import { Token } from "./tokens";
import { tokenBalance } from ".";

// Constants for contract addresses
const POOL_FACTORY_CONTRACT_ADDRESS = "0x0227628f3F023bb0B980b67D528571c95c6DaC1c"; // Address of the Uniswap V3 Factory contract
const SWAP_ROUTER_CONTRACT_ADDRESS = "0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E"; // Address of the Uniswap V3 Swap Router contract

// Part B - Function to approve the Swap Router contract to spend tokens
const approveToken = async (
  tokenAddress: string, // The address of the token to be approved
  tokenABI: any,        // The ABI of the token contract (ERC20 standard)
  amount: bigint,       // The amount of tokens to approve for spending
  wallet: any           // The wallet/signer object to sign the transaction
) => {
  try {
    // Create a new contract instance for the token
    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, wallet);

    // Prepare the approval transaction to allow the Swap Router to spend the specified amount
    const approveTransaction = await tokenContract.approve.populateTransaction(
      SWAP_ROUTER_CONTRACT_ADDRESS,
      amount
    );

    // Send the approval transaction
    const transactionResponse = await wallet.sendTransaction(
      approveTransaction
    );
    console.log(`-------------------------------`);
    console.log(`Sending Approval Transaction...`);
    console.log(`-------------------------------`);
    console.log(`Transaction Sent: ${transactionResponse.hash}`);
    console.log(`-------------------------------`);

    // Wait for the transaction to be confirmed
    const receipt = await transactionResponse.wait();
    console.log(
      `Approval Transaction Confirmed! https://sepolia.etherscan.io/tx/${receipt.hash}`
    );
  } catch (error) {
    console.error("An error occurred during token approval:", error);
    throw new Error("Token approval failed"); // Throw an error if the approval fails
  }
}

// Part C - Function to get information about the pool for the given token pair
const getPoolInfo = async (
  factoryContract: any, // The Uniswap V3 Factory contract instance
  tokenIn: Token,       // The input token object (e.g., LINK)
  tokenOut: Token,      // The output token object (e.g., ETH)
  provider: any         // The provider object for connecting to the blockchain
) => {
  // Fetch the pool address for the token pair from the factory contract
  const poolAddress = await factoryContract.getPool(
    tokenIn.address,
    tokenOut.address,
    3000 // The fee tier (3000 means 0.3% fee)
  );

  // If the pool address is not found, throw an error
  if (!poolAddress) {
    throw new Error("Failed to get pool address");
  }

  // Create a new contract instance for the pool
  const poolContract = new ethers.Contract(poolAddress, POOL_ABI, provider);

  // Fetch the pool details (token0, token1, fee)
  const [token0, token1, fee] = await Promise.all([
    poolContract.token0(),
    poolContract.token1(),
    poolContract.fee(),
  ]);

  return { poolContract, token0, token1, fee }; // Return the pool contract and details
}

// Part D - Function to prepare swap parameters for the exactInputSingle function
const prepareSwapParams = async (
  poolContract: any,    // The pool contract instance
  signer: any,          // The signer object to sign the transaction
  amountIn: bigint,     // The amount of input tokens to swap
  tokenIn: Token,       // The input token object
  tokenOut: Token       // The output token object
) => {
  return {
    tokenIn: tokenIn.address,      // Address of the input token
    tokenOut: tokenOut.address,    // Address of the output token
    fee: await poolContract.fee(), // The fee tier for the pool
    recipient: signer.address,     // Address of the recipient (who receives the output tokens)
    amountIn: amountIn,            // The amount of input tokens to swap
    amountOutMinimum: 0,           // Minimum amount of output tokens expected (0 means no minimum)
    sqrtPriceLimitX96: 0,          // The price limit (0 means no limit)
  };
}

// Part E - Function to execute the token swap on Uniswap V3
const executeSwap = async (
  swapRouter: any, // The Uniswap V3 Swap Router contract instance
  params: any,     // The prepared swap parameters
  signer: any      // The signer object to sign the transaction
) => {
  // Prepare the swap transaction using the exactInputSingle function
  const transaction = await swapRouter.exactInputSingle.populateTransaction(
    params,
    { gasLimit: 300000 } // Optional gas limit for the transaction
  );
  try {
    // Send the transaction
    const receipt = await signer.sendTransaction(transaction);
    console.log(`-------------------------------`);
    console.log(`Receipt: https://sepolia.etherscan.io/tx/${receipt.hash}`);
    console.log(`-------------------------------`);

    return receipt.hash; // Return the transaction hash of the swap
  } catch (error) {
    throw new Error("Token swap failed"); // Throw an error if the swap fails
  }
}

// Part F - Main function to orchestrate the token swap process
export const swap = async (
  swapAmount: string, // The amount of input tokens to swap as a string
  tokenIn: Token,     // The input token object
  tokenOut: Token,    // The output token object
  signer: any,        // The signer object to sign the transaction
  provider: any       // The provider object for connecting to the blockchain
) => {
  const inputAmount = swapAmount; // The amount to swap
  const amountIn = ethers.parseUnits(inputAmount.toString(), tokenIn.decimal); // Convert the input amount to a BigInt based on token decimals

  // Fetch the current balance of the input token in the user's wallet
  const getTokenBalance = await tokenBalance(tokenIn.address, TOKEN_IN_ABI, signer, tokenIn.decimal);

  // If the balance is less than 1, alert the user and exit
  if (Number(getTokenBalance) < 1) {
    alert("No tokens available to swap, please select another pair for swapping...");
    return;
  }

  // Create a new contract instance for the Uniswap V3 Factory contract
  const factoryContract = new ethers.Contract(
    POOL_FACTORY_CONTRACT_ADDRESS,
    FACTORY_ABI,
    provider
  );

  try {
    // Approve the Swap Router to spend the input tokens
    await approveToken(tokenIn.address, TOKEN_IN_ABI, amountIn, signer);

    // Get the pool information for the token pair
    const { poolContract } = await getPoolInfo(factoryContract, tokenIn, tokenOut, provider);

    // Prepare the swap parameters
    const params = await prepareSwapParams(poolContract, signer, amountIn, tokenIn, tokenOut);

    // Create a new contract instance for the Uniswap V3 Swap Router contract
    const swapRouter = new ethers.Contract(
      SWAP_ROUTER_CONTRACT_ADDRESS,
      SWAP_ROUTER_ABI,
      signer
    );

    // Execute the swap and get the transaction hash
    const txHash = await executeSwap(swapRouter, params, signer);

    return txHash; // Return the transaction hash of the swap
  } catch (error: any) {
    console.error("An error occurred:", error.message); // Log any errors that occur during the swap process
    throw new Error("Token swap failed"); // Throw an error if the swap fails
  }
}
