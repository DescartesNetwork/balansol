import { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'
import { BN, utils, web3 } from '@project-serum/anchor'

import { Button, Input, Modal } from 'antd'

import { notifyError, notifySuccess } from 'app/helper'
import { AppState } from 'app/model'
import { useAccount, useWallet } from '@senhub/providers'

const Withdraw = ({ poolAddress }: { poolAddress: string }) => {
  const [visible, setVisible] = useState(false)
  const [lptAmount, setLptAmount] = useState(0)
  const {
    pools: { [poolAddress]: poolData },
  } = useSelector((state: AppState) => state)
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const { accounts } = useAccount()

  const onSubmit = async () => {
    try {
      await checkInitializedAccount()
      const { txId } = await window.sen_balancer.removeLiquidity(
        poolAddress,
        new BN(lptAmount),
      )
      notifySuccess('Withdraw', txId)
    } catch (error) {
      notifyError(error)
    }
  }

  const checkInitializedAccount = async () => {
    for (const mint of poolData.mints) {
      const tokenAccount = await utils.token.associatedAddress({
        owner: new web3.PublicKey(walletAddress),
        mint,
      })
      if (!accounts[tokenAccount.toBase58()]) {
        const { wallet, splt } = window.sentre
        if (!wallet) throw new Error('Login fist')
        await splt.initializeAccount(mint.toBase58(), walletAddress, wallet)
      }
    }
  }

  return (
    <Fragment>
      <Button onClick={() => setVisible(true)}>Withdraw</Button>
      {/* Modal deposit */}
      <Modal
        title="Basic Modal"
        visible={visible}
        onCancel={() => setVisible(false)}
      >
        <Input onChange={(e) => setLptAmount(Number(e.target.value))} />
        <Button onClick={onSubmit}>Submit</Button>
      </Modal>
    </Fragment>
  )
}

export default Withdraw
