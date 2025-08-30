import { useWeb3 } from "@/context/Web3Context";
import { shortAddr } from "@/lib/format";

export default function Navbar() {
  const { account, connect, disconnect } = useWeb3();
  return (
    <header className="border-b bg-white">
      <nav className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-lg">FairPay</span>
        </div>
        <div>
          {account ? (
            <button onClick={disconnect} className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm">
              {shortAddr(account)} · Disconnect
            </button>
          ) : (
            <button onClick={connect} className="px-3 py-2 rounded bg-primary-500 text-white text-sm hover:opacity-90">
              Connect Wallet
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
