import { PoolData } from '@senswap/sen-js'
import { DailyReport } from '../entities/daily-report'
import { TransLog } from '../entities/trans-log'

export default class DailyReportService {
  parserDailyReport(transLogs: TransLog[]): DailyReport[] {
    let reports = new Array<DailyReport>()
    for (const transLog of transLogs) {
      reports = reports.concat(this.parseDailyReport(transLog))
    }
    return this.mergeDailyReport(reports)
  }

  parseDailyReport(transLog: TransLog): DailyReport[] {
    const dailyReports = new Array<DailyReport>()
    const { programId, time, actionType, actionTransfers } = transLog
    for (const transfer of actionTransfers) {
      const { source, destination, amount } = transfer

      const report = new DailyReport()
      report.programId = programId
      report.time = time
      report.actionType = actionType

      if (source) {
        const { mint, address } = source
        dailyReports.push({
          ...report,
          mint: mint,
          address: address,
          amountOut: BigInt(amount),
        })
      }
      if (destination) {
        const { mint, address } = destination
        dailyReports.push({
          ...report,
          mint: mint,
          address: address,
          amountIn: BigInt(amount),
        })
      }
    }
    return dailyReports
  }

  mergeDailyReport(dailyReports: Array<DailyReport>): Array<DailyReport> {
    const map = new Map<string, DailyReport>()
    for (const report of dailyReports) {
      const key = `${report.time}^${report.address}^${report.mint}^${report.actionType}`
      if (map.has(key)) {
        const val = map.get(key)
        if (val !== undefined) {
          report.amountIn += val.amountIn
          report.amountOut += val.amountOut
          report.totalTrans += val.totalTrans
        }
      }
      map.set(key, report)
    }
    const results = new Array<DailyReport>()
    map.forEach((report) => results.push(report))
    return results
  }
}

export type MapTreasury = { poolAddress: string; data: PoolData }
