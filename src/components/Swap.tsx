import React, { useState } from 'react'
import {swap} from "../utils/swap";
import { useEthersSigner, useEthersProvider } from "../utils/ethers.ts";
import {tokens} from "../utils/tokens";

const Swap: React.FC = () => {
  const [fromToken, setFromToken] = useState('')
  const [swapComplete, setSwapComplete] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [toToken, setToToken] = useState('')
  const [amount, setAmount] = useState('')
  const [swapping, setSwapping] = useState(false);

  const signer = useEthersSigner();
  const provider = useEthersProvider();

  const handleSwap = async () => {
    // Implement swap logic here
    console.log('Swapping tokens')
    if(amount && toToken && fromToken) {
      setSwapping(true);
      try {
        const txHash = await swap(amount, signer, provider);
        setTransactionHash(txHash);
        setSwapComplete(true);
      } catch (error: any) {
        console.log(error);
      } finally {
        setSwapping(false);
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {swapComplete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-50 text-sm rounded-lg p-6 max-w-[600px]">
            <h3 className="text-xl font-bold mb-4">Swap Complete</h3>
            <p className="mb-4">Your swap has been successfully completed.</p>
            <p className="mb-4">
              Transaction Hash:{' '}
              <a
                href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-700 hover:text-green-800"
              >
                {transactionHash}
              </a>
            </p>
            <button
              onClick={() => setSwapComplete(false)}
              className="bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6 min-w-[400px]">
        <h2 className="text-2xl font-bold mb-4">Swap Tokens (on Uniswap)</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <select
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50 border py-3 px-2 outline-none"
            >
              <option value="">Select a token</option>
              {Object.keys(tokens).map((tokenName, index) => (
                <option key={index} value={tokens[tokenName].symbol}>{tokens[tokenName].symbol}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <select
              value={toToken}
              onChange={(e) => setToToken(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50 border py-3 px-2 outline-none"
            >
              <option value="">Select a token</option>
              {Object.keys(tokens).map((tokenName, index) => (
                <option key={index} value={tokens[tokenName].symbol}>{tokens[tokenName].symbol}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50 border py-3 px-2 outline-none"
              placeholder="0.0"
            />
          </div>
          <button
            onClick={handleSwap}
            className="w-full bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50"
          >
            {swapping ? (
              <span className="inline-block ml-2 animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-200"></span>
            ) : (
              "Swap Tokens"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Swap
