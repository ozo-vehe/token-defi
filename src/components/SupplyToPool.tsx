import React, { useState } from 'react'
import { supply } from '../utils/supply';
import { useEthersProvider, useEthersSigner } from '../utils/ethers';
import { tokens } from "../utils/tokens";

const SupplyToPool: React.FC = () => {
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("");
  const [supplying, setSupplying] = useState(false);
  const [supplyingComplete, setSupplyingComplete] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");

  const signer = useEthersSigner();
  const provider = useEthersProvider();

  const handleSupply = async () => {
    if (token) {
      try {
        setSupplying(true);
        const txHash = await supply(amount, signer, provider, token);
        setTransactionHash(txHash);
        setSupplyingComplete(true);
      } catch (error: any) {
        console.log(error);
      } finally {
        setSupplying(false);
      }
    } else {
      console.log("Token not chosen");
      alert("Select a token to supply to the pool");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {supplyingComplete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-50 text-sm rounded-lg p-6 max-w-[600px]">
            <h3 className="text-xl font-bold mb-4">Supply Complete</h3>
            <p className="mb-4">Your supply to the pool has been successfully completed.</p>
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
              onClick={() => setSupplyingComplete(false)}
              className="bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6 min-w-[400px]">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Supply to AAVE Pool</h2>
        <div className="mb-4">
          <label htmlFor="tokenAddress" className="block text-sm font-medium text-gray-700 mb-1">
            Token
          </label>
          <select
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50 border py-3 px-2 outline-none"
          >
            <option value="">Select a token</option>
            {Object.keys(tokens).map((tokenName, index) => (
              <option key={index} value={tokens[tokenName].symbol}>{tokens[tokenName].symbol}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
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
          onClick={handleSupply}
          className="w-full bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50"
        >
          {supplying ? (
            <span className="inline-block ml-2 animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-200"></span>
          ) : (
            "Supply Tokens"
          )}
        </button>
      </div>
    </div>
  )
}

export default SupplyToPool;
