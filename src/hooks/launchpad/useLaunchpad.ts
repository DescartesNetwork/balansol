import { useCallback, useMemo } from 'react'
import { Address, BN, Program, utils, web3 } from '@project-serum/anchor'
import { getAnchorProvider } from '@sentre/senhub'

import { DEFAULT_BALANCER_IDL } from 'constant'
import { BalancerAmm } from './balancer_amm'
import configs from 'configs'

const TOKEN_PROGRAM_ID = new web3.PublicKey(
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
)

const PROGRAMS = {
  rent: web3.SYSVAR_RENT_PUBKEY,
  systemProgram: web3.SystemProgram.programId,
  associatedTokenProgram: utils.token.ASSOCIATED_PROGRAM_ID,
  tokenProgram: TOKEN_PROGRAM_ID,
}

export const useLaunchpad = () => {
  const provider = getAnchorProvider()!

  const balancerLaunchpad = useMemo(() => {
    return new Program<BalancerAmm>(
      DEFAULT_BALANCER_IDL,
      configs.sol.balancerAddress,
      provider,
    )
  }, [provider])

  const deriveMasterAddress = useCallback(
    async (launchpad: Address) => {
      const [master] = await web3.PublicKey.findProgramAddress(
        [
          Buffer.from('master'),
          new web3.PublicKey(launchpad).toBuffer(),
          provider.wallet.publicKey.toBuffer(),
        ],
        new web3.PublicKey(configs.sol.balancerAddress),
      )
      return master
    },
    [provider.wallet.publicKey],
  )

  const initializeLaunchpad = useCallback(
    async ({
      baseAmount,
      mint,
      stableMint,
      sendAndConfirm = true,
      launchpad = web3.Keypair.generate(),
    }: {
      baseAmount: BN
      mint: web3.PublicKey
      stableMint: web3.PublicKey
      sendAndConfirm: boolean
      launchpad?: web3.Keypair
    }) => {
      const master = await deriveMasterAddress(launchpad.publicKey)
      // Base Mint
      const [baseMint] = await web3.PublicKey.findProgramAddress(
        [Buffer.from('base_mint'), launchpad.publicKey.toBuffer()],
        balancerLaunchpad.programId,
      )
      const tokenAccountBaseMint = await utils.token.associatedAddress({
        mint: baseMint,
        owner: provider.wallet.publicKey,
      })
      const txInitLaunchpad = await balancerLaunchpad.methods
        .initializeLaunchpad(baseAmount)
        .accounts({
          authority: provider.wallet.publicKey,
          master,
          launchpad: launchpad.publicKey,
          mint,
          baseMint,
          stableMint,
          tokenAccountBaseMint,
          rent: web3.SYSVAR_RENT_PUBKEY,
          systemProgram: web3.SystemProgram.programId,
          associatedTokenProgram: utils.token.ASSOCIATED_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          balansolProgram: balancerLaunchpad.programId,
        })
        .transaction()

      let txId = ''
      if (sendAndConfirm) {
        txId = await provider.sendAndConfirm(txInitLaunchpad, [launchpad])
      }

      return { txId, tx: txInitLaunchpad, baseMint }
    },
    [
      balancerLaunchpad.methods,
      balancerLaunchpad.programId,
      deriveMasterAddress,
      provider,
    ],
  )

  const activeLaunchpad = useCallback(
    async ({
      pool,
      launchpad,
      startTime,
      endTime,
      endWeights,
      metadata,
      sendAndConfirm,
    }: {
      pool: web3.PublicKey
      launchpad: web3.PublicKey
      startTime: BN
      endTime: BN
      endWeights: BN[]
      metadata: number[]
      sendAndConfirm: boolean
    }) => {
      const master = await deriveMasterAddress(launchpad)
      const txTransferOwner = await balancerLaunchpad.methods
        .transferOwnership(new web3.PublicKey(master))
        .accounts({
          authority: provider.wallet.publicKey,
          pool,
        })
        .transaction()

      const txActive = await balancerLaunchpad.methods
        .activeLaunchpad(startTime, endTime, endWeights, metadata)
        .accounts({
          authority: provider.wallet.publicKey,
          pool,
          master,
          launchpad,
          ...PROGRAMS,
        })
        .transaction()

      const tx = new web3.Transaction()
      tx.add(txTransferOwner)
      tx.add(txActive)
      let txId = ''
      if (sendAndConfirm) {
        txId = await provider.sendAndConfirm(tx)
      }

      return { txId, tx }
    },
    [balancerLaunchpad.methods, deriveMasterAddress, provider],
  )

  return { initializeLaunchpad, activeLaunchpad }
}
