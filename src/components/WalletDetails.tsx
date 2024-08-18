import React, { useState, useEffect } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { getBalance } from '../utils';
import { useEthersSigner } from "../utils/ethers.ts";

// interface Token {
//   name: string | undefined;
//   balance: string | number | undefined;
//   symbol: string | undefined;
// }
interface Token {
  name: string | undefined;
  symbol: string;
  address: string | undefined;
  decimal: number;
  balance: number | string
}

const WalletDetails: React.FC = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const { address, isConnected, chain } = useAccount();
  const { data: balance } = useBalance({ address });

  const signer = useEthersSigner();
  
  const getAccountDetails = async () => {
    const availableTokens = await getBalance(signer);

    const sepoliaToken: Token = {
      name: chain?.name,
      balance: Number(balance?.formatted).toFixed(2),
      symbol: "sETH",
      address: undefined,
      decimal: 6,
    }

    setTokens((tokens) => (
      tokens = [sepoliaToken, ...availableTokens]
    ))
  }


  useEffect(() => {
    getAccountDetails();
  }, [address, chain, balance])

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <p className="text-xl font-semibold text-center text-gray-800">Wallet not connected</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md min-w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Wallet Details</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Connection Status</p>
            <p className="text-lg font-semibold text-green-700">Connected</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Address</p>
            <p className="text-lg font-semibold text-gray-800">{address}</p>
          </div>
          <div className="mt-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Network</th>
                  <th className="py-2 px-4 text-right text-sm font-medium text-gray-600">Balance</th>
                </tr>
              </thead>
              <tbody>
                {tokens.length <= 0 && (
                  <tr className="relative text-center justify-center h-12">
                  <p className="absolute left-[50%] animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-500 mt-4"></p>
                  </tr>
                )}
                {tokens.map((token, _i) => (
                <tr key={_i} className="border-t border-gray-200">
                  <td className="py-3 px-4 text-sm text-gray-800">{token.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-800 text-right">
                    {Number(token.balance).toFixed(2)} {token.symbol}
                  </td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WalletDetails;
