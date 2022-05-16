import { Fragment, useState } from 'react'

import { Button, Modal } from 'antd'
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
        icon={<IonIcon name="add-outline" />}
        onClick={() => setVisible(true)}
        style={{ borderRadius: 40 }}
        block
        ghost
      >
        New Pool
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
