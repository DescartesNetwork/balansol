import { Provider } from 'react-redux'
import {
  WalletProvider,
  MintProvider,
  AccountProvider,
  PoolProvider,
  AntdProvider,
} from '@sentre/senhub'

import View from 'view'

import model from 'model'
import configs from 'configs'

import 'static/styles/light.less'
import 'static/styles/dark.less'

const {
  manifest: { appId },
} = configs

export const Page = () => {
  return (
    <AntdProvider appId={appId} prefixCls={appId}>
      <WalletProvider>
        <AccountProvider>
          <MintProvider>
            <PoolProvider>
              <Provider store={model}>
                <View />
              </Provider>
            </PoolProvider>
          </MintProvider>
        </AccountProvider>
      </WalletProvider>
    </AntdProvider>
  )
}

export * from 'static.app'
