import { useState } from 'react'

import BarChart from './charts/barChart'

export type VolumeData = { data: number; label: string }

const Volume24h = ({ poolAddress }: { poolAddress: string }) => {
  const [volumes24h, setVolume24h] = useState<VolumeData[]>([])

  return <BarChart data={volumes24h} />
}

export default Volume24h
