import { Env } from '@sentre/senhub'

/**
 * Contructor
 */

type BasicEndpoint = { base: string } & Record<string, string>
type Conf = {
  origin: string
  version: BasicEndpoint
}

const generator = (origin: string): Conf => ({
  origin,
  version: {
    base: origin + '/public/api/v1',
    get tvl() {
      return this.base + '/tvl'
    },
    get detailTvl() {
      return this.base + '/tvl/all/'
    },
  },
})

const conf: Record<Env, Conf> = {
  /**
   * Development configurations
   */
  development: {
    ...generator('https://stat.sentre.io'),
  },

  /**
   * Production configurations
   */
  production: {
    ...generator('https://stat.sentre.io'),
  },
}

/**
 * Module exports
 */
export default conf
