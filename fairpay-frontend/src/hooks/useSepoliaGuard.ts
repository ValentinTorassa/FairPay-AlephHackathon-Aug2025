import { useWeb3 } from "@/context/Web3Context";
import { SEPOLIA_CHAIN_ID } from "@/constants/config";
export function useSepoliaGuard() {
  const { chainId } = useWeb3();
  const ok = chainId === SEPOLIA_CHAIN_ID;
  return { ok, chainId };
}
