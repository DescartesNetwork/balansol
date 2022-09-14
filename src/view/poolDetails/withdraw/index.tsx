import { Fragment, useState } from 'react'

import { Button, Modal } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import WithdrawModal from './withdrawModal'

const Withdraw = ({ poolAddress }: { poolAddress: string }) => {
  const [visible, setVisible] = useState(false)

  return (
    <Fragment>
      <Button ghost onClick={() => setVisible(true)} block>
        Withdraw
      </Button>
      {/* Modal withdraw */}
      <Modal
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        destroyOnClose
        centered
        closeIcon={<IonIcon name="close-outline" />}
      >
        <WithdrawModal
          poolAddress={poolAddress}
          hideModal={() => setVisible(false)}
        />
      </Modal>
    </Fragment>
  )
}

export default Withdraw
