// import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useState } from 'react';
import Navbar from './components/Navbar';
import WalletDetails from './components/WalletDetails';
import Swap from './components/Swap';
import SupplyToPool from "./components/SupplyToPool";
import Pool from "./components/Pool";
import YieldFarming from './components/YieldFarming';

function App() {
  // const account = useAccount();
  // const { connectors, connect, status, error } = useConnect();
  // const { disconnect } = useDisconnect();
  const [link, navLink] = useState("wallet details");

  return (
    <>
      <Navbar setLink={(lnk) => navLink(lnk.text)} />

      {link == "wallet details" && <WalletDetails />}
      {link == "swap" && <Swap />}
      {link == "supply" && <SupplyToPool />}
      {link == "pool" && <Pool />}
      {link == "yield farming" && <YieldFarming />}
    </>
  )
}

export default App
