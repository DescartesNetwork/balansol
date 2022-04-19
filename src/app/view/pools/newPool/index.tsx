import { Fragment, useState } from 'react'

import { Button, Modal, Typography } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import ModalNewPool from './modalNewPool'

export type TokenInfo = {
  addressToken: string
  weight: string
  isLocked: boolean
}

const NewPool = () => {
  const [visible, setVisible] = useState(false)
  return (
    <Fragment>
      <Button
        className="btn-outline"
        icon={<IonIcon name="add-outline" />}
        onClick={() => setVisible(true)}
        style={{ borderRadius: 40 }}
        block
      >
        New pool
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
