import { assertType, describe, expect, test, vi } from 'vitest'

import { createPublicClient } from './createPublicClient'
import { createTransport } from './transports/createTransport'
import { http } from './transports/http'
import { ethereumProvider } from './transports/ethereumProvider'
import { webSocket } from './transports/webSocket'
import { localhost } from '../chains'
import type { PublicRequests } from '../types/eip1193'
import { localWsUrl } from '../../test/utils'

const mockTransport = () =>
  createTransport({
    key: 'mock',
    name: 'Mock Transport',
    request: vi.fn(() => null) as any,
    type: 'mock',
  })

test('creates', () => {
  const { uid, ...client } = createPublicClient({
    transport: mockTransport,
  })

  assertType<PublicRequests['request']>(client.request)

  expect(uid).toBeDefined()
  expect(client).toMatchInlineSnapshot(`
    {
      "chain": undefined,
      "key": "public",
      "name": "Public Client",
      "pollingInterval": 4000,
      "request": [Function],
      "transport": {
        "key": "mock",
        "name": "Mock Transport",
        "request": [MockFunction spy],
        "type": "mock",
      },
      "type": "publicClient",
    }
  `)
})

describe('transports', () => {
  test('http', () => {
    const { uid, ...client } = createPublicClient({
      chain: localhost,
      transport: http(),
    })

    expect(uid).toBeDefined()
    expect(client).toMatchInlineSnapshot(`
      {
        "chain": {
          "id": 1337,
          "name": "Localhost",
          "nativeCurrency": {
            "decimals": 18,
            "name": "Ether",
            "symbol": "ETH",
          },
          "network": "localhost",
          "rpcUrls": {
            "default": {
              "http": [
                "http://127.0.0.1:8545",
              ],
            },
          },
        },
        "key": "public",
        "name": "Public Client",
        "pollingInterval": 4000,
        "request": [Function],
        "transport": {
          "key": "http",
          "name": "HTTP JSON-RPC",
          "request": [Function],
          "type": "http",
          "url": undefined,
        },
        "type": "publicClient",
      }
    `)
  })

  test('webSocket', () => {
    const { uid, ...client } = createPublicClient({
      chain: localhost,
      transport: webSocket({ url: localWsUrl }),
    })

    expect(uid).toBeDefined()
    expect(client).toMatchInlineSnapshot(`
      {
        "chain": {
          "id": 1337,
          "name": "Localhost",
          "nativeCurrency": {
            "decimals": 18,
            "name": "Ether",
            "symbol": "ETH",
          },
          "network": "localhost",
          "rpcUrls": {
            "default": {
              "http": [
                "http://127.0.0.1:8545",
              ],
            },
          },
        },
        "key": "public",
        "name": "Public Client",
        "pollingInterval": 4000,
        "request": [Function],
        "transport": {
          "getSocket": [Function],
          "key": "webSocket",
          "name": "WebSocket JSON-RPC",
          "request": [Function],
          "subscribe": [Function],
          "type": "webSocket",
        },
        "type": "publicClient",
      }
    `)
  })

  test('ethereumProvider', () => {
    const { uid, ...client } = createPublicClient({
      transport: ethereumProvider({ provider: { request: async () => null } }),
    })

    expect(uid).toBeDefined()
    expect(client).toMatchInlineSnapshot(`
      {
        "chain": undefined,
        "key": "public",
        "name": "Public Client",
        "pollingInterval": 4000,
        "request": [Function],
        "transport": {
          "key": "ethereumProvider",
          "name": "Ethereum Provider",
          "request": [Function],
          "type": "ethereumProvider",
        },
        "type": "publicClient",
      }
    `)
  })
})
