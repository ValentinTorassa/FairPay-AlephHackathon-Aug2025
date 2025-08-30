import { useMemo } from "react";
import { getBrowserProvider, getContract } from "@/lib/ethers";
import { CONTRACT_ADDRESS } from "@/constants/config";
import { FAIRPAY_ABI } from "@/types/contract";

export function useContract() {
  return useMemo(() => ({
    async withSigner() {
      const provider = await getBrowserProvider();
      const signer = await provider.getSigner();
      return getContract(CONTRACT_ADDRESS, FAIRPAY_ABI, signer);
    }
  }), []);
}
