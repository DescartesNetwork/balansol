import { PoolData } from '@senswap/balancer'
import { BN } from '@coral-xyz/anchor'
import { util, PDB, TokenProvider } from '@sentre/senhub'

import { TransLog } from 'stat/entities/trans-log'
import { TotalSummary } from 'stat/constants/summary'
import { DailyReport } from 'stat/entities/daily-report'
import { DateHelper } from 'stat/helpers/date'
import { utilsBN } from 'helper/utilsBN'
import PoolTransLogService, { SwapActionType } from './poolTranslog'
import DailyReportService from '../daily-report'

const DATE_RANGE = 8

export default class PoolService {
  poolAddress: string
  poolData: PoolData | undefined
  poolTransLogService = new PoolTransLogService()
  dailyReportService = new DailyReportService()
  tokenProvider = new TokenProvider()

  constructor(poolAddress: string) {
    this.poolAddress = poolAddress
  }

  getPoolData = async (): Promise<PoolData> => {
    if (!this.poolData) {
      const balansol = window.balansol
      this.poolData = await balansol.getPoolData(this.poolAddress)
    }
    return this.poolData
  }

  getUsd = async (mint: string, amountBigint: bigint) => {
    const mintInfo = await this.tokenProvider.findByAddress(mint)
    if (!mintInfo) return 0
    const { decimals, extensions } = mintInfo
    try {
      const cgkData = await util.fetchCGK(extensions?.coingeckoId)
      if (!cgkData?.price) return 0
      const amount = utilsBN.undecimalize(
        new BN(amountBigint.toString()),
        decimals,
      )
      return Number(amount) * cgkData.price
    } catch (error) {
      return 0
    }
  }

  fetchTransLog = async (timeFrom: number, timeTo: number) => {
    const db = new PDB(this.poolAddress).createInstance('stat')
    let cacheTransLog: TransLog[] = (await db.getItem('translogs')) || []
    cacheTransLog = cacheTransLog.sort((a, b) => b.blockTime - a.blockTime)
    const fistTransLog = cacheTransLog[0]
    const lastTransLog = cacheTransLog[cacheTransLog.length - 1]

    if (fistTransLog && lastTransLog) {
      const [beginTransLogs] = await Promise.all([
        this.poolTransLogService.collect(this.poolAddress, {
          secondFrom: fistTransLog.blockTime,
          secondTo: timeTo,
        }),
      ])
      cacheTransLog = cacheTransLog.filter(
        (trans) => trans.blockTime > timeFrom,
      )
      cacheTransLog = [...beginTransLogs, ...cacheTransLog]
    } else {
      cacheTransLog = await this.poolTransLogService.collect(this.poolAddress, {
        secondFrom: timeFrom,
        secondTo: timeTo,
      })
    }
    await db.setItem('translogs', cacheTransLog)
    return cacheTransLog
  }

  getDailyInfo = async () => {
    let timeTo = new DateHelper()
    const timeFrom = new DateHelper().subtractDay(DATE_RANGE)
    const { fee, taxFee, treasuries } = await this.getPoolData()

    // fetch transLog
    const transLogs = await this.fetchTransLog(
      timeFrom.seconds(),
      timeTo.seconds(),
    )
    // parse daily + create map time
    const dailyReports = this.dailyReportService.parserDailyReport(transLogs)
    const mapTimeDailyReport: Record<number, DailyReport[]> = {}
    for (const report of dailyReports) {
      const { time, address } = report
      // filter daily report
      if (!treasuries.map((e) => e.toBase58().includes(address))) continue
      if (!mapTimeDailyReport[time]) mapTimeDailyReport[time] = []
      mapTimeDailyReport[time].push(report)
    }
    // parse summary

    const mapTimeTotal: Record<string, TotalSummary> = {}
    mapTimeTotal[timeTo.ymd()] = {
      tvl: 0,
      fee: 0,
      volume: 0,
    }

    while (timeTo.ymd() > timeFrom.ymd()) {
      const reports = mapTimeDailyReport[timeTo.ymd()] || []
      const currentReport = mapTimeTotal[timeTo.ymd()]
      const prevDate = timeTo.subtractDay(1)
      if (!mapTimeTotal[prevDate.ymd()] && prevDate.ymd() >= timeFrom.ymd()) {
        mapTimeTotal[prevDate.ymd()] = {
          tvl: currentReport.tvl,
          fee: 0,
          volume: 0,
        }
      }
      for (const report of reports) {
        const amountOut = await this.getUsd(report.mint, report.amountOut)
        const amountIn = await this.getUsd(report.mint, report.amountIn)
        if (mapTimeTotal[prevDate.ymd()]) {
          mapTimeTotal[prevDate.ymd()].tvl += amountOut - amountIn
          if (mapTimeTotal[prevDate.ymd()].tvl < 0)
            mapTimeTotal[prevDate.ymd()].tvl = 0
        }
        if (report.actionType === SwapActionType.Swap) {
          mapTimeTotal[timeTo.ymd()].volume += amountIn + amountOut
          const totalFee =
            Number(utilsBN.undecimalize(fee.add(taxFee), 9)) * amountOut
          mapTimeTotal[timeTo.ymd()].fee += totalFee
        }
      }
      timeTo = timeTo.subtractDay(1)
    }

    return mapTimeTotal
  }
}
