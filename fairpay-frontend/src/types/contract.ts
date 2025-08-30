// Minimal ABI for MVP flows (adjust with your real ABI)
export const FAIRPAY_ABI = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "depositWei", "type": "uint256" },
      { "internalType": "uint256", "name": "unitPriceWei", "type": "uint256" }
    ],
    "name": "startSession",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "closeSession",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [ { "internalType": "uint256", "name": "units", "type": "uint256" } ],
    "name": "reportUsage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [ { "internalType": "address", "name": "user", "type": "address" } ],
    "name": "getUserSession",
    "outputs": [
      { "internalType": "uint256", "name": "depositWei", "type": "uint256" },
      { "internalType": "uint256", "name": "unitPriceWei", "type": "uint256" },
      { "internalType": "uint256", "name": "consumedUnits", "type": "uint256" },
      { "internalType": "bool",    "name": "active",       "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
