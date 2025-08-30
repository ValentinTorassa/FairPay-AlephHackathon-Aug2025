export const RPC_URL = import.meta.env.VITE_RPC_URL as string;
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as string;
export const ETHERSCAN_BASE = (import.meta.env.VITE_ETHERSCAN_BASE as string) || "https://sepolia.etherscan.io";
export const BACKEND_BASE_URL = (import.meta.env.VITE_BACKEND_BASE_URL as string) || "http://localhost:3001";
export const SEPOLIA_CHAIN_ID = 11155111; // 0xaa36a7
