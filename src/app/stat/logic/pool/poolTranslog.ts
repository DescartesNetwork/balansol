import base58 from 'bs58'
import { TransLog } from './../../entities/trans-log'
import { TransLogService } from './../translog'

const { struct } = require('soprox-abi')

const TRANSLOG_PROGRAM_DATA_SCHEMA = { key: 'code', type: 'u8' }

export enum SwapActionType {
  InitPool = 'INITIALIZE_POOL',
  AddLiquidity = 'ADD_LIQUIDITY',
  RemoveLiquidity = 'REMOVE_LIQUIDITY',
  Swap = 'SWAP',
  Route = 'SWAP',
}

const ACTION_TYPE: Record<number, SwapActionType> = {
  0: SwapActionType.InitPool,
  1: SwapActionType.AddLiquidity,
  10: SwapActionType.AddLiquidity,
  2: SwapActionType.RemoveLiquidity,
  3: SwapActionType.Swap,
  8: SwapActionType.Route,
}

export default class PoolTransLogService extends TransLogService {
  parseAction = (transLog: TransLog) => {
    const programDataEncode = transLog.programInfo?.data
    if (!programDataEncode) return ''
    const dataBuffer = base58.decode(programDataEncode)
    const actionLayout = new struct([TRANSLOG_PROGRAM_DATA_SCHEMA])
    const programDataDecode: { code: number } = actionLayout.fromBuffer(
      Buffer.from(dataBuffer),
    )

    return ACTION_TYPE[programDataDecode.code] || ''
  }
}
