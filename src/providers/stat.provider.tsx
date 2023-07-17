import { Fragment, PropsWithChildren, useCallback } from 'react'
import { useDebounce } from 'react-use'
import { create } from 'zustand'
import produce from 'immer'

import { TotalSummary } from 'stat/constants/summary'
import PoolService from 'stat/logic/pool/pool'
import { DateHelper } from 'stat/helpers/date'
import { useAppRouter } from 'hooks/useAppRouter'
import Memo from 'helper/memo'

type SummaryStore = { [day: string]: TotalSummary }
type StoreData = { [poolAddr: string]: SummaryStore }

type StatStore = {
  loading: boolean
  setLoading: (loading: boolean) => void
  data: StoreData
  upsert: (poolAddr: string, poolSummary: SummaryStore) => void
}

export const useStatStore = create<StatStore>()((set) => ({
  loading: false,
  setLoading: (loading) => set({ loading }),
  data: {},
  upsert: (poolAddr: string, poolSummary: SummaryStore) =>
    set(
      produce<StatStore>(({ data }) => {
        if (!data[poolAddr]) data[poolAddr] = {}
        Object.assign(data[poolAddr], poolSummary)
      }),
    ),
}))

const DATE_RANGE = 7

const StatProvider = ({ children }: PropsWithChildren<{}>) => {
  const { getQuery } = useAppRouter()
  const poolAddress = getQuery('pool')
  const { setLoading, upsert } = useStatStore()

  const syncDailyReport = useCallback(async () => {
    if (!poolAddress) return
    try {
      setLoading(true)
      let timeTo = new DateHelper()
      const timeFrom = new DateHelper().subtractDay(DATE_RANGE)
      const poolStatService = new PoolService(poolAddress)
      const dailyInfo = await Memo.call('getDailyInfo' + poolAddress, () =>
        poolStatService.getDailyInfo(timeFrom, timeTo),
      )
      upsert(poolAddress, dailyInfo)
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }, [poolAddress, setLoading, upsert])
  useDebounce(syncDailyReport, 300, [syncDailyReport])

  return <Fragment>{children}</Fragment>
}

export default StatProvider
