import { Provider } from 'react-redux'
import {
  WalletProvider,
  UIProvider,
  MintProvider,
  AccountProvider,
  PoolProvider,
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
    <UIProvider
      appId={appId}
      antd={{ prefixCls: appId }}
      style={{ paddingBottom: 12 }}
    >
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
    </UIProvider>
  )
}

export * from 'static.app'
