import { Fragment, useState } from 'react'

import { Button, Modal } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import DepositModal from './depositModal'

const Deposit = ({ poolAddress }: { poolAddress: string }) => {
  const [visible, setVisible] = useState(false)

  return (
    <Fragment>
      <Button type="primary" onClick={() => setVisible(true)} block>
        Deposit
      </Button>
      {/* Modal deposit */}
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        destroyOnClose
        centered={true}
        closeIcon={<IonIcon name="close-outline" />}
      >
        <DepositModal
          poolAddress={poolAddress}
          hideModal={() => setVisible(false)}
        />
      </Modal>
    </Fragment>
  )
}

export default Deposit
