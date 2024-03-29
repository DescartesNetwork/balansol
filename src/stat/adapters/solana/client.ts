import { rpc } from '@sentre/senhub'
import { web3 } from '@coral-xyz/anchor'

import { OptionsFetchSignature } from '../../constants/transaction'

const DEFAULT_LIMIT = 700
const TRANSACTION_LIMIT = 200

export class Solana {
  private conn: web3.Connection = new web3.Connection(rpc)

  //Search for all signatures from last Signature and earlier
  //So: If new collection (to now) -> last Signature = null
  private async fetchSignatures(
    address: web3.PublicKey,
    lastSignature?: string,
    limit: number = DEFAULT_LIMIT,
  ): Promise<Array<web3.ConfirmedSignatureInfo>> {
    if (limit > DEFAULT_LIMIT) limit = DEFAULT_LIMIT
    const options: web3.ConfirmedSignaturesForAddress2Options = {
      limit: limit,
      before: lastSignature,
    }
    return this.conn.getConfirmedSignaturesForAddress2(address, options)
  }

  private async fetchConfirmTransaction(signatures: string[]) {
    let confirmedTransactions: web3.ParsedConfirmedTransaction[] = []
    let limit = TRANSACTION_LIMIT
    const promiseTransGroup = []
    for (let offset = 0; offset <= signatures.length / limit; offset++) {
      const skip = offset * limit
      const signaturesGroup = signatures.slice(skip, skip + limit)
      promiseTransGroup.push(
        this.conn.getParsedTransactions(signaturesGroup, {
          maxSupportedTransactionVersion: 0,
        }),
      )
    }
    const transGroups = await Promise.all(promiseTransGroup)
    for (const transGroup of transGroups) {
      //@ts-ignore
      confirmedTransactions = confirmedTransactions.concat(transGroup)
    }
    return confirmedTransactions
  }

  async fetchTransactions(
    programId: string,
    options: OptionsFetchSignature,
  ): Promise<web3.ParsedConfirmedTransaction[]> {
    const currentTime = new Date().getTime() / 1000
    let { secondFrom, secondTo, lastSignature, limit } = options
    secondFrom = Math.floor(secondFrom || 0)
    secondTo = Math.floor(secondTo || currentTime)

    const programPublicKey = new web3.PublicKey(programId)
    let signatures: string[] = []
    let isStop = false

    while (!isStop) {
      const confirmedSignatureInfos: web3.ConfirmedSignatureInfo[] =
        await this.fetchSignatures(programPublicKey, lastSignature, limit)
      if (!confirmedSignatureInfos?.length || isStop) break
      for (const info of confirmedSignatureInfos) {
        lastSignature = info.signature
        const blockTime = info.blockTime || 0
        if (!blockTime || blockTime > secondTo || info.err) continue
        if (blockTime < secondFrom) {
          isStop = true
          break
        }
        signatures.push(info.signature)
      }

      if (limit && signatures.length >= limit) break
      if (confirmedSignatureInfos?.length < (limit || DEFAULT_LIMIT)) break
    }
    const confirmedTransactions = await this.fetchConfirmTransaction(signatures)
    return confirmedTransactions
  }
}
