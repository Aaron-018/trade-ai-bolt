import { PublicKey } from '@solana/web3.js'

type Chain = 'solana' | 'eip155'
export function isValidAddress(address: string, chain: Chain = 'solana') {
  if (chain === 'solana') {
    try {
      new PublicKey(address)
      return true
    } catch (error) {
      return false
    }
  }
}
