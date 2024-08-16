import React, { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import Logo from './Logo';
// import { ChevronDownIcon } from '@heroicons/react/solid'

interface NavbarProps {
  setLink: (link: { text: string }) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setLink }) => {
  // const account = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const [isOpen, setIsOpen] = useState(false);

  const links = ["wallet details", "swap", "supply", "pool"]

  useEffect(() => {
    if (!isConnected) {
      setIsOpen(false)
    }
  }, [isConnected])

  return (
    <nav className="navbar border border-gray-100 lg:px-16 md:px-8 px-4">
      <div className="navbar-container flex flex-wrap items-center justify-between py-2">
        <Logo />

        <div className="flex space-x-4 justify-center my-4">
          {links.map((link, _i) => (
            <button key={_i} className={`px-4 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-opacity-50 capitalize`} onClick={() => setLink({ text: `${link}` })}>{link}</button>
          ))}
        </div>

        <div className="relative">
          {!isConnected ? (
            <button
              onClick={() => connect({ connector: connectors[0] })}
              className="bg-green-700 hover:bg-green-800 text-gray-50 py-2 px-4 rounded-md"
            >
              Connect Wallet
            </button>
          ) : (
            <div>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded flex items-center"
              >
                {address?.slice(0, 6)}...{address?.slice(-4)}
                {/* <ChevronDownIcon className="w-5 h-5 ml-2" /> */}
              </button>
              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <button
                    onClick={() => {
                      disconnect()
                      setIsOpen(false)
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar;
