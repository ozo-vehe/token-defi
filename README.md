# Token DeFi: Uniswap and Aave

## Project Introduction

This project is a comprehensive demonstration of the composability and integration of decentralized finance (DeFi) protocols. The script focuses on two major DeFi platforms: Uniswap and Aave. By leveraging Uniswap for token swapping and Aave for lending, the script showcases a streamlined workflow that allows users to convert USDC into LINK and immediately utilize that LINK in Aave’s lending pool to earn interest. This process not only highlights the potential for seamless interaction between DeFi protocols but also provides a foundational template for more complex financial strategies in the decentralized space.

## Overview

The primary objective of this project is to illustrate how DeFi protocols can be interconnected to create more sophisticated financial operations. This script begins by swapping USDC for LINK on Uniswap, followed by supplying the acquired LINK to Aave's lending pool. By doing so, the user can immediately start earning interest on the supplied LINK. The project demonstrates the ease of integrating various DeFi protocols to build a robust and efficient financial workflow.

## Functionalities

### 1. **Swapping on Uniswap**
   - **Objective**: Convert USDC into LINK.
   - **Process**: The script initiates an approval for Uniswap to spend the user’s USDC. After approval, the script executes a swap transaction on Uniswap, exchanging USDC for LINK based on the current market rate.
   
### 2. **Supply to Aave**
   - **Objective**: Supply LINK to Aave to earn interest.
   - **Process**: The LINK acquired from the Uniswap swap is then approved for Aave. Once approved, the LINK is supplied to Aave’s lending pool, where it starts generating interest for the user.

### 3. **Viewing Supply Pool**
   - **Objective**: Check the current state of the supply in Aave.
   - **Process**: The script allows users to query the Aave pool to view the amount of LINK they have supplied and the current interest being earned.

### 4. **Withdraw from Aave**
   - **Objective**: Withdraw the supplied LINK from Aave.
   - **Process**: Users can initiate a withdrawal of their supplied LINK from the Aave pool. The script handles the transaction, ensuring the user’s tokens are safely returned to their wallet.

## Diagram Illustration

![Flowchart](https://github.com/ozo-vehe/token-defi/blob/main/download.png) <!-- Ensure the image is properly linked -->

The diagram above illustrates the entire process flow, starting from connecting the wallet, performing a token swap on Uniswap, and finally supplying the swapped tokens to Aave’s lending pool.

## Code Explanation

### 1. **Swap USDC for LINK on Uniswap**
   - **Approval Function**: 
     - Before performing the swap, the script calls an `approve` function on the USDC token contract, which allows the Uniswap router contract to spend the user's USDC tokens. 
   - **Swap Function**: 
     - After approval, the script interacts with the Uniswap router contract’s `swapExactTokensForTokens` function. This function handles the exchange of USDC for LINK at the current market rate.
   - **Transaction Confirmation**: 
     - The script monitors the transaction, ensuring it is confirmed on the blockchain. Once confirmed, the user receives LINK tokens in their wallet.

### 2. **Supply LINK to Aave**
   - **Approval Function**:
     - Similar to the Uniswap interaction, the script first calls an `approve` function on the LINK token contract, granting the Aave lending pool contract permission to spend the user’s LINK tokens.
   - **Supply Function**:
     - The script then interacts with Aave’s lending pool contract, calling the `deposit` function to supply the LINK tokens. This function locks the LINK tokens into the Aave pool, where they start earning interest immediately.

### 3. **Viewing Supply Pool**
   - **Supply Balance Query**:
     - The script includes functionality to interact with Aave’s `getUserReserveData` function, allowing users to view their current balance and accrued interest for the supplied LINK tokens.
   - **Interest Rate Query**:
     - The script also queries the current interest rate being earned on the supplied LINK, providing real-time insights into the user's earnings.

### 4. **Withdraw from Aave**
   - **Withdraw Function**:
     - To facilitate the withdrawal, the script calls Aave’s `withdraw` function, specifying the amount of LINK the user wishes to withdraw. The script handles the transaction, ensuring the user’s LINK tokens are safely transferred back to their wallet.

## Conclusion

This project serves as a foundational example of how DeFi protocols can be combined to create a more efficient and user-friendly financial system. By integrating Uniswap and Aave, the script demonstrates the seamless interoperability of DeFi protocols, paving the way for more complex and innovative financial products in the decentralized world.
