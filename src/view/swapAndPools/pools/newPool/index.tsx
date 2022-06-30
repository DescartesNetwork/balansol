import { Fragment, useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { PoolState } from '@senswap/balancer'
import { useWallet } from '@sentre/senhub'

import { Button, Modal } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import ModalNewPool from './modalNewPool'
import { AppState } from 'model'

export type TokenInfo = {
  addressToken: string
  weight: string
  isLocked: boolean
}

const NewPool = () => {
  const pools = useSelector((state: AppState) => state.pools)
  const [visible, setVisible] = useState(false)
  const [isInProcess, setIsInProcess] = useState(false)
  const { wallet } = useWallet()

  const checkUninitializedPool = useCallback(async () => {
    for (const poolAddress in pools) {
      const poolData = pools[poolAddress]
      if (poolData.authority.toBase58() !== wallet.address) continue
      if (!(poolData.state as PoolState)['uninitialized']) continue
      return setIsInProcess(true)
    }
    return setIsInProcess(false)
  }, [pools, wallet.address])

  useEffect(() => {
    checkUninitializedPool()
  }, [checkUninitializedPool])

  return (
    <Fragment>
      <Button
        icon={<IonIcon name={!isInProcess ? 'add-outline' : 'sync-outline'} />}
        onClick={() => setVisible(true)}
        style={{ borderRadius: 40 }}
        block
        ghost
      >
        {!isInProcess ? 'New Pool' : 'Resume'}
      </Button>
      <Modal
        visible={visible}
        onCancel={() => {
          setVisible(false)
        }}
        closeIcon={<IonIcon name="close" />}
        footer={null}
        destroyOnClose
        centered
        width={572}
      >
        <ModalNewPool onClose={() => setVisible(false)} />
      </Modal>
    </Fragment>
  )
}

export default NewPool
