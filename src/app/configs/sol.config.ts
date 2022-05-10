import { Net } from 'shared/runtime'

/**
 * Contructor
 */
type Conf = {
  node: string
  spltAddress: string
  splataAddress: string
  balancerAddress: string
  taxmanAddress: string
}

const conf: Record<Net, Conf> = {
  /**
   * Development configurations
   */
  devnet: {
    node: 'https://api.devnet.solana.com',
    spltAddress: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    splataAddress: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
    balancerAddress: 'J9vAQKiJLg1GtGqLVRhLe4aHTdQ9585WwkPQ3qpM2LpK',
    taxmanAddress: 'GJLqpmDxxrV9xruee2vFvEoTho7VVQHRtuHH8nfoAE54',
  },

  /**
   * Staging configurations
   */
  testnet: {
    node: 'https://api.testnet.solana.com',
    spltAddress: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    splataAddress: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
    balancerAddress: '',
    taxmanAddress: '',
  },

  /**
   * Production configurations
   */
  mainnet: {
    node: 'http://api.google.mainnet-beta.solana.com/',
    spltAddress: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    splataAddress: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
    balancerAddress: '',
    taxmanAddress: '',
  },
}

/**
 * Module exports
 */
export default conf
