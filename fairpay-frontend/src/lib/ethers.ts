import { BrowserProvider, Contract, JsonRpcProvider } from "ethers";
import { RPC_URL } from "@/constants/config";

export const jsonProvider = new JsonRpcProvider(RPC_URL);

export async function getBrowserProvider() {
  if (!(window as any).ethereum) throw new Error("MetaMask not found");
  return new BrowserProvider((window as any).ethereum);
}

export function getContract<T extends Contract>(address: string, abi: any, providerOrSigner: any) {
  return new Contract(address, abi, providerOrSigner) as T;
}
