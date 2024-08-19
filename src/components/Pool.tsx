import { FC, useEffect, useState } from 'react'
import { getPoolData } from '../utils';
import { useEthersSigner, useEthersProvider } from "../utils/ethers";
import { Token } from '../utils/tokens';
import { withdraw } from '../utils/withdraw';
import { getTokensArr } from '../utils';

const Pool: FC = () => {
  const [aaveTokens, setAaveTokens] = useState<Token[]>([]);
  const [tokensArr, setTokensArr] = useState<Token[]>([]);
  const [withdrawalComplete, setWithdrawalComplete] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [withdrawing, setWithdrawing] = useState("");

  const signer = useEthersSigner();
  const provider = useEthersProvider();

  const handleWithdraw = async (aToken: Token) => {
    if (aToken) {
      setWithdrawing(aToken.name);
      const aTokenIndex = aaveTokens.indexOf(aToken);
      const token = tokensArr[aTokenIndex];
      try {
        // await reserveBalance(provider, signer, token);
        const txHash = await withdraw(aToken.balance, signer, provider, token);
        setTransactionHash(txHash);
        setWithdrawing("");
      } catch (error: any) {
        console.log(error);
      }
    }
  }
  const getUserPoolData = async () => {
    try {
      const poolData = await getPoolData(signer);
      const tokensArr = await getTokensArr();

      setTokensArr(tokensArr);

      setAaveTokens(poolData);
    } catch (error: any) {
      console.log(error);
    }
  }

  useEffect(() => {
    getUserPoolData();
  }, [])

  return (
    <div className="flex items-center justify-center text-sm min-h-[90vh] bg-gray-100">
      {withdrawalComplete && (
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
              onClick={() => setWithdrawalComplete(false)}
              className="bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
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
            {aaveTokens.length <= 0 && (
              <tr className="relative text-center justify-center h-12">
                <p className="absolute left-[50%] animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-500 mt-4"></p>
              </tr>
            )}
            {aaveTokens.map((_token, _i) => (
              <tr key={_i} className="border-b">
                <td className="py-2 pl-4">{_token.symbol}</td>
                <td className="py-2 text-center">{Number(_token.balance).toFixed(2)}</td>
                <td className="py-2 text-right">
                  <button
                    onClick={() => handleWithdraw(_token)}
                    className="bg-[#dda432] hover:bg-[#ba8a2a] text-white py-1 px-3 w-full h-[30px] flex items-center justify-center rounded"
                  >
                    {withdrawing == _token.name ? (
                      <span className="inline-block ml-2 animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-200"></span>
                    ) : (
                      "withdraw"
                    )}
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
