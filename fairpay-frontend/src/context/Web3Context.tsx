import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getBrowserProvider } from "@/lib/ethers";
import { SEPOLIA_CHAIN_ID } from "@/constants/config";

interface Web3State {
  account?: string;
  chainId?: number;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const Ctx = createContext<Web3State | undefined>(undefined);

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<string>();
  const [chainId, setChainId] = useState<number>();

  useEffect(() => {
    const eth = (window as any).ethereum;
    if (!eth) return;

    const handleAccountsChanged = (accs: string[]) => setAccount(accs?.[0]);
    const handleChainChanged = (cid: string) => setChainId(parseInt(cid, 16));

    eth.request({ method: "eth_accounts" }).then((accs: string[]) => setAccount(accs?.[0]));
    eth.request({ method: "eth_chainId" }).then((cid: string) => setChainId(parseInt(cid, 16)));

    eth.on?.("accountsChanged", handleAccountsChanged);
    eth.on?.("chainChanged", handleChainChanged);
    return () => {
      eth?.removeListener?.("accountsChanged", handleAccountsChanged);
      eth?.removeListener?.("chainChanged", handleChainChanged);
    };
  }, []);

  const connect = async () => {
    const provider = await getBrowserProvider();
    const accs = await provider.send("eth_requestAccounts", []);
    setAccount(accs?.[0]);
    const cidHex = await provider.send("eth_chainId", []);
    setChainId(parseInt(cidHex, 16));

    if (parseInt(cidHex, 16) !== SEPOLIA_CHAIN_ID) {
      await (window as any).ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }],
      }).catch(async () => {
        await (window as any).ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: "0xaa36a7",
            chainName: "Sepolia Test Network",
            nativeCurrency: { name: "SepoliaETH", symbol: "ETH", decimals: 18 },
            rpcUrls: [import.meta.env.VITE_RPC_URL],
            blockExplorerUrls: [import.meta.env.VITE_ETHERSCAN_BASE]
          }]
        });
      });
    }
  };

  const disconnect = async () => { setAccount(undefined); };

  const value = useMemo(() => ({ account, chainId, connect, disconnect }), [account, chainId]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWeb3() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWeb3 must be used within Web3Provider");
  return ctx;
}
