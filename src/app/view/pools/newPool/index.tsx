import { Fragment, useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { PoolState } from '@senswap/balancer'
import { useWallet } from '@senhub/providers'

import { Button, Modal, Typography } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import ModalNewPool from './modalNewPool'
import { AppState } from 'app/model'

export type TokenInfo = {
  addressToken: string
  weight: string
  isLocked: boolean
}

const NewPool = () => {
  const { pools } = useSelector((state: AppState) => state)
  const [visible, setVisible] = useState(false)
  const [isInProcess, setIsInProcess] = useState(false)
  const { wallet } = useWallet()

  const checkUninitializePool = useCallback(async () => {
    for (const poolAddress in pools) {
      const poolData = pools[poolAddress]
      if (poolData.authority.toBase58() !== wallet.address) continue
      if (!(poolData.state as PoolState)['uninitialized']) continue
      return setIsInProcess(true)
    }
    return setIsInProcess(false)
  }, [pools, wallet.address])

  useEffect(() => {
    checkUninitializePool()
  }, [checkUninitializePool])

  return (
    <Fragment>
      <Button
        className="btn-outline"
        icon={<IonIcon name={!isInProcess ? 'add-outline' : 'sync-outline'} />}
        onClick={() => setVisible(true)}
        style={{ borderRadius: 40 }}
        block
      >
        {!isInProcess ? 'New Pool' : 'Resume'}
      </Button>
      <Modal
        title={<Typography.Title level={4}>New Pool</Typography.Title>}
        visible={visible}
        onCancel={() => {
          setVisible(false)
        }}
        closeIcon={<IonIcon name="close" />}
        footer={null}
        destroyOnClose={true}
        centered={true}
        width={572}
        className="modal-balansol"
      >
        <ModalNewPool onClose={() => setVisible(false)} />
      </Modal>
    </Fragment>
  )
}

export default NewPool
