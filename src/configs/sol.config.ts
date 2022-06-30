import { Net } from '@sentre/senhub'

/**
 * Contructor
 */
type Conf = {
  spltAddress: string
  splataAddress: string
  balancerAddress: string
  taxmanAddress: string
  bidMintDefault: string
  askMintDefault: string
}

const conf: Record<Net, Conf> = {
  /**
   * Development configurations
   */
  devnet: {
    spltAddress: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    splataAddress: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
    balancerAddress: 'Hxzy3cvdPz48RodavEN4P41TZp4g6Vd1kEMaUiZMof1u',
    taxmanAddress: 'GJLqpmDxxrV9xruee2vFvEoTho7VVQHRtuHH8nfoAE54',
    bidMintDefault: '2z6Ci38Cx6PyL3tFrT95vbEeB3izqpoLdxxBkJk2euyj',
    askMintDefault: '5YwUkPdXLoujGkZuo9B4LsLKj3hdkDcfP4derpspifSJ',
  },

  /**
   * Staging configurations
   */
  testnet: {
    spltAddress: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    splataAddress: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
    balancerAddress: '',
    taxmanAddress: '',
    bidMintDefault: '',
    askMintDefault: '',
  },

  /**
   * Production configurations
   */
  mainnet: {
    spltAddress: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    splataAddress: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
    balancerAddress: 'D3BBjqUdCYuP18fNvvMbPAZ8DpcRi4io2EsYHQawJDag',
    taxmanAddress: '9doo2HZQEmh2NgfT3Yx12M89aoBheycYqH1eaR5gKb3e',
    bidMintDefault: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    askMintDefault: 'SENBBKVCM7homnf5RX9zqpf1GFe935hnbU4uVzY1Y6M',
  },
}

/**
 * Module exports
 */
export default conf
