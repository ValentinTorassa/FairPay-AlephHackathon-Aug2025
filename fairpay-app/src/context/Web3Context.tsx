import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { BrowserProvider, JsonRpcSigner } from 'ethers'

interface Web3ContextType {
  account: string | null
  chainId: number | null
  provider: BrowserProvider | null
  signer: JsonRpcSigner | null
  isConnected: boolean
  isMetaMaskInstalled: boolean
  connect: () => Promise<void>
  disconnect: () => void
  switchToSepolia: () => Promise<void>
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined)

const SEPOLIA_CHAIN_ID = 11155111
const SEPOLIA_HEX = '0xaa36a7'

interface Web3ProviderProps {
  children: ReactNode
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const [account, setAccount] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [provider, setProvider] = useState<BrowserProvider | null>(null)
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null)
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState<boolean>(false)

  const isConnected = !!account

  useEffect(() => {
    const checkMetaMask = () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        setIsMetaMaskInstalled(true)
      } else {
        setIsMetaMaskInstalled(false)
      }
    }
    
    checkMetaMask()
    
    // Check again after a short delay in case MetaMask is still loading
    const timeout = setTimeout(checkMetaMask, 1000)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect()
        } else {
          setAccount(accounts[0])
        }
      }

      const handleChainChanged = (chainId: string) => {
        setChainId(parseInt(chainId, 16))
      }

      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [])

  const connect = async () => {
    try {
      if (!window.ethereum) {
        console.warn('MetaMask not detected. Please install MetaMask to connect your wallet.')
        return
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      if (accounts.length === 0) {
        throw new Error('No accounts found')
      }

      const browserProvider = new BrowserProvider(window.ethereum)
      const network = await browserProvider.getNetwork()
      const walletSigner = await browserProvider.getSigner()

      setAccount(accounts[0])
      setChainId(Number(network.chainId))
      setProvider(browserProvider)
      setSigner(walletSigner)

      if (Number(network.chainId) !== SEPOLIA_CHAIN_ID) {
        await switchToSepolia()
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  const disconnect = () => {
    setAccount(null)
    setChainId(null)
    setProvider(null)
    setSigner(null)
  }

  const switchToSepolia = async () => {
    try {
      if (!window.ethereum) return

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_HEX }],
      })
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: SEPOLIA_HEX,
                chainName: 'Sepolia Test Network',
                nativeCurrency: {
                  name: 'Sepolia Ether',
                  symbol: 'SEP',
                  decimals: 18,
                },
                rpcUrls: ['https://sepolia.infura.io/v3/'],
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              },
            ],
          })
        } catch (addError) {
          console.error('Failed to add Sepolia network:', addError)
        }
      } else {
        console.error('Failed to switch to Sepolia:', switchError)
      }
    }
  }

  const value = {
    account,
    chainId,
    provider,
    signer,
    isConnected,
    isMetaMaskInstalled,
    connect,
    disconnect,
    switchToSepolia,
  }

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
}

export function useWeb3() {
  const context = useContext(Web3Context)
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider')
  }
  return context
}

declare global {
  interface Window {
    ethereum?: any
  }
}