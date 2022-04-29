import { TransLog } from './../../entities/trans-log'
import { TransLogService } from './../translog'

export enum SwapActionType {
  Swap = 'SWAP',
}

export default class PoolTransLogService extends TransLogService {
  parseAction = (transLog: TransLog) => {
    try {
      const programDataEncode = transLog.programInfo?.data
      const swapData = (
        window.balansol.program.coder.instruction as any
      ).decode(programDataEncode, 'base58')
      if (swapData?.name === 'route') return SwapActionType.Swap
    } catch (error) {}
    return ''
  }
}
