import type { SignableRequests, WalletRequests } from '../types/eip1193'
import type { Transport } from './transports/createTransport'
import type { Client, ClientConfig } from './createClient'
import { createClient } from './createClient'
import type { Chain } from '../chains'

export type WalletClientConfig<
  TTransport extends Transport = Transport,
  TChain extends Chain = Chain,
> = {
  chain?: ClientConfig<TTransport, TChain>['chain']
  /** The key of the Wallet Client. */
  key?: ClientConfig['key']
  /** The name of the Wallet Client. */
  name?: ClientConfig['name']
  /** Frequency (in ms) for polling enabled actions & events. Defaults to 4_000 milliseconds. */
  pollingInterval?: ClientConfig['pollingInterval']
  transport: ClientConfig<TTransport, TChain>['transport']
}

export type WalletClient<
  TTransport extends Transport = Transport,
  TChain extends Chain = Chain,
> = Client<TTransport, TChain, SignableRequests & WalletRequests>

/**
 * @description Creates a wallet client with a given transport.
 *
 * - Only has access to "wallet" & "signable" EIP-1474 RPC methods
 * (ie. `eth_sendTransaction`, `eth_requestAccounts`, etc).
 *
 * @example
 * import { createWalletClient, ethereumProvider } from 'viem/clients'
 * const client = createWalletClient(
 *  ethereumProvider({ provider: window.ethereum })
 * )
 */
export function createWalletClient<
  TTransport extends Transport,
  TChain extends Chain,
>({
  transport,
  key = 'wallet',
  name = 'Wallet Client',
  pollingInterval,
}: WalletClientConfig<TTransport, TChain>): WalletClient<TTransport, TChain> {
  return {
    ...createClient({
      key,
      name,
      pollingInterval,
      transport,
      type: 'walletClient',
    }),
  }
}
