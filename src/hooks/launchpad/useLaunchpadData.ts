import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { AppState } from 'model'
import { Ipfs } from 'shared/ipfs'
import { ProjectInfoData } from 'constant'

export const useLaunchpadData = (address: string) => {
  const launchpadData = useSelector(
    (state: AppState) => state.launchpads[address],
  )
  const [metadata, setMetadata] = useState<ProjectInfoData>()

  useEffect(() => {
    ;(async () => {
      const metadata = launchpadData.metadata
      const projectInfo = await Ipfs.methods.launchpad.get(metadata)
      return setMetadata(projectInfo)
    })()
  }, [address, launchpadData])

  return { launchpadData, metadata }
}
