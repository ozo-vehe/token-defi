# Token DeFi: Uniswap and Aave

## Project Introduction

This project demonstration the composability and integration of decentralized finance (DeFi) protocols. The scripts written in this project focuses on two major DeFi platforms: Uniswap and Aave. By leveraging Uniswap for token swapping and Aave for lending, the script showcases a streamlined workflow that allows users to convert tokens(USDC, LINK, DAI, WETH) on Uniswap and immediately utilize the token gotten in Aave’s lending pool to earn interest.

## Functionalities

### 1. **Swapping on Uniswap**
   - **Objective**: Convert one token into another.
   - **Process**: The script initiates an approval for Uniswap to spend the user’s token. After approval, the script executes a swap transaction on Uniswap, exchanging the desired token for another token based on the current market rate.
   
### 2. **Supply to Aave**
   - **Objective**: Supply the token gotten from the swap to Aave to earn interest.
   - **Process**: The token acquired from the Uniswap swap is then approved for Aave. Once approved, it is supplied to Aave’s lending pool, where it starts generating interest for the user.

### 3. **Viewing Supply Pool**
   - **Objective**: Check the current state of the supply in Aave.
   - **Process**: The script allows users to query the Aave pool to view the amount of tokens they have supplied and the current interest being earned.

### 4. **Withdraw from Aave**
   - **Objective**: Withdraw the supplied token from Aave.
   - **Process**: Users can initiate a withdrawal of their supplied token from the Aave pool. The script handles the transaction, ensuring the user’s tokens are safely returned to their wallet.

## Diagram Illustration

![Flowchart](https://github.com/ozo-vehe/token-defi/blob/main/download.png)

The diagram above illustrates the entire process flow, starting from connecting the wallet, performing a token swap on Uniswap, supplying the swapped tokens to Aave’s lending pool and finally withdrawing supplied token from Aave's pool.

## Code Explanation

### 1. **Swapping tokens on Uniswap**
   - code can be found in `utils/swap.ts`
   - **Approval Function**: 
     - Before performing the swap, the script calls an `approve` function on the token contract, which allows the Uniswap router contract to spend the user's tokens. 
   - **Swap Function**: 
     - After approval, the script prepares the swap parameters with the `prepareSwapParams()` function and then interacts with the Uniswap router contract’s `swapExactTokensForToken()` function. This function handles the exchange of one token for another at the current market rate.
   - **Transaction Confirmation**: 
     - The script monitors the transaction, ensuring it is confirmed on the blockchain. Once confirmed, the user receives the desired tokens in their wallet.

### 2. **Supply token to Aave**
   - code can be found in `utils/supply.ts`
   - **Approval Function**:
     - Similar to the Uniswap interaction, the script first calls an `approve` function on the token's contract, granting the Aave lending pool contract permission to spend the user’s tokens.
   - **Supply Function**:
     - The script then interacts with Aave’s lending pool contract, calling the `supply()` function to supply the token. This function locks the token into the Aave pool, where they start earning interest immediately.

### 3. **Viewing Supply Pool**
   - code can be found in `utils/index.ts`
   - **Supply Balance Query**:
     - The script interacts with Aave’s `getUserReserveData` function to retrieve the current amount of a specific token (in this case, LINK) that has been supplied to the Aave pool by the user. This provides real-time information on the user’s balance within the Aave lending pool.

### 4. **Withdraw from Aave**
   - code can be found in `utils/withdraw.ts`
   - **Withdraw Function**:
     - To facilitate the withdrawal, the script calls Aave’s `withdraw` function, specifying the amount of token the user wishes to withdraw. The script checks if the amount is available and then handles the transaction, ensuring the user’s tokens are safely transferred back to their wallet.

## Conclusion

This project serves as a foundational example of how DeFi protocols can be combined to create a more efficient and user-friendly financial system. By integrating Uniswap and Aave, the script demonstrates the seamless interoperability of DeFi protocols, paving the way for more complex and innovative financial products in the decentralized world.
