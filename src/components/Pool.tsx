import { FC, useEffect, useState } from 'react'
import { getPoolData } from '../utils';
import { useEthersSigner, useEthersProvider } from "../utils/ethers";
// import { Token } from '../types/Token'

// interface PoolProps {
//   tokens: Token[]
//   onWithdraw: (tokenId: string) => void
// }
interface Token {
  id: string | undefined;
  name: string | undefined;
  balance: string | undefined;
  symbol: string | undefined;
}

const Pool: FC = () => {
  const [tokens, setTokens] = useState<Token[]>([]);

  const signer = useEthersSigner();
  const provider = useEthersProvider();

  const handleWithdraw = async (tokenId: string | undefined) => {
    if (tokenId) {
      try {
        console.log(`Withdrawing ${tokenId}`);
        const poolData = await getPoolData(signer, provider);
        // console.log(poolData);
        setTokens(poolData);
      } catch (error: any) {
        console.log(error);
      }
    }
  }
  const getUserPoolData = async () => {
    try {
      const poolData = await getPoolData(signer, provider);
      setTokens(poolData);
    } catch (error: any) {
      console.log(error);
    }
  }

  useEffect(() => {
    getUserPoolData();
  }, [])

  return (
    <div className="flex items-center justify-center text-sm min-h-[90vh] bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md min-w-[400px]">
        <h2 className="text-2xl font-bold mb-4">Funding Pool</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Token</th>
              <th className="py-2 px-4 text-center text-sm font-medium text-gray-600">Balance</th>
              <th className="py-2 px-4 text-right text-sm font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token) => (
              <tr key={token.id} className="border-b">
                <td className="py-2 pl-4">{token.symbol}</td>
                <td className="py-2 text-center">{Number(token.balance).toFixed(2)}</td>
                <td className="py-2 text-right">
                  <button
                    onClick={() => handleWithdraw(token.id)}
                    className="bg-[#dda432] hover:bg-[#ba8a2a] text-white py-1 px-3 rounded"
                  >
                    withdraw
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Pool
