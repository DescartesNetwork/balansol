import { useSelector } from 'react-redux'
import { useEffect, useMemo, useState } from 'react'

import { AppState } from 'model'
import { Ipfs } from 'shared/ipfs'
import { ProjectInfoData } from 'constant'
import { DEFAULT_LAUNCHPAD } from 'view/launchpad/initLaunchpad'

export const useLaunchpadData = (address: string) => {
  const launchpads = useSelector((state: AppState) => state.launchpads)
  const [metadata, setMetadata] = useState<ProjectInfoData>()

  const launchpadData = useMemo(
    () => (launchpads[address] ? launchpads[address] : DEFAULT_LAUNCHPAD),
    [address, launchpads],
  )

  useEffect(() => {
    ;(async () => {
      const metadata = launchpads[address].metadata
      const projectInfo = await Ipfs.methods.launchpad.get(metadata)
      return setMetadata(projectInfo)
    })()
  }, [address, launchpads])

  return { launchpadData, metadata }
}
