// src/constants/config.ts

// Lee las variables de entorno que configuraste en .env
export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE || "single"; 
// "single" o "direct"

export const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || "";

// En single mode, wallet estática
export const SINGLE_WALLET_ADDRESS = import.meta.env.VITE_SINGLE_WALLET_ADDRESS || "";

// En direct mode, contrato desplegado en Sepolia
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "";

// Base URL de Etherscan (Sepolia por defecto)
export const ETHERSCAN_BASE = import.meta.env.VITE_ETHERSCAN_BASE || "https://sepolia.etherscan.io";
