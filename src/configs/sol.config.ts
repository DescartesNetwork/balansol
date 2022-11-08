import { rpc, Net } from '@sentre/senhub'
import { Connection } from '@solana/web3.js'

/**
 * Contructor
 */
type Conf = {
  connection: Connection
  balancerAddress: string
  taxmanAddress: string
  bidMintDefault: string
  askMintDefault: string
  launchpadAddress: string
}

const conf: Record<Net, Conf> = {
  /**
   * Development configurations
   */
  devnet: {
    connection: new Connection(rpc),
    balancerAddress: '6SRa2Kc3G4wTG319G4Se6yrRWeS1A1Hj79BC3o7X9v6T',
    taxmanAddress: 'GJLqpmDxxrV9xruee2vFvEoTho7VVQHRtuHH8nfoAE54',
    bidMintDefault: '2z6Ci38Cx6PyL3tFrT95vbEeB3izqpoLdxxBkJk2euyj',
    askMintDefault: '5YwUkPdXLoujGkZuo9B4LsLKj3hdkDcfP4derpspifSJ',
    launchpadAddress: '54e31kYfV9KSfrXBCdxn2aAuL7hY5WhvDuqGaNhFYAJe',
  },

  /**
   * Staging configurations
   */
  testnet: {
    connection: new Connection(rpc),
    balancerAddress: '',
    taxmanAddress: '',
    bidMintDefault: '',
    askMintDefault: '',
    launchpadAddress: '',
  },

  /**
   * Production configurations
   */
  mainnet: {
    connection: new Connection(rpc),
    balancerAddress: 'D3BBjqUdCYuP18fNvvMbPAZ8DpcRi4io2EsYHQawJDag',
    taxmanAddress: '9doo2HZQEmh2NgfT3Yx12M89aoBheycYqH1eaR5gKb3e',
    bidMintDefault: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    askMintDefault: 'SENBBKVCM7homnf5RX9zqpf1GFe935hnbU4uVzY1Y6M',
    launchpadAddress: '54e31kYfV9KSfrXBCdxn2aAuL7hY5WhvDuqGaNhFYAJe',
  },
}

/**
 * Module exports
 */
export default conf
