import { isPlainObject } from 'lodash-es'

type IncludePromise<T> = T | Promise<T>

export interface ConnectMethods {
  [namespace: string]: {
    [methodName: string]: (...args: any[]) => any
  }
}

export type Messenger<T extends ConnectMethods, N extends keyof T, M extends keyof T[N]> = {
  namespace: N
  process: {
    method: M
    args: Parameters<T[N][M]>
  }[]
}

export type Methods<T extends ConnectMethods, N extends keyof T> = {
  [P in keyof T[N]]: (...args: Parameters<T[N][P]>) => IncludePromise<ReturnType<T[N][P]>>
}

export type ResponceType<T extends ConnectMethods, N extends keyof T> = {
  [P in keyof T[N]]?: ReturnType<T[N][P]>
}

export const createRunner = <T extends ConnectMethods>() => async <N extends keyof T, M extends keyof T[N]>(
  namespace: N,
  msg: Messenger<T, N, M>,
  methods: Methods<T, N>
) => {
  if (!msg || !msg.hasOwnProperty('namespace') || msg.namespace !== namespace) return
  const results: { [methodName: string]: any } = {}
  for (const { method, args } of msg.process) {
    if (!methods.hasOwnProperty(method)) continue
    const methodRes = await methods[method](...args)
    results[method as string] = methodRes
  }
  return results
}

export const createSender = <T extends ConnectMethods>() => <N extends keyof T, M extends keyof T[N]>(
  namespace: N,
  process: Messenger<T, N, M>['process'],
  tabId?: number
) => {
  const msg = {
    namespace,
    process,
  }
  return new Promise<ResponceType<T, N>>(resolve => {
    const callback = (res: unknown) => {
      if (isPlainObject(res)) resolve(res as object)
      resolve({})
    }
    typeof tabId === 'number' ? chrome.tabs.sendMessage(tabId, msg, callback) : chrome.runtime.sendMessage(msg, callback)
  })
}

export const createReceiver = <T extends ConnectMethods>() => <N extends keyof T>(namespace: N, methods: Methods<T, N>) => {
  chrome.runtime.onMessage.addListener((msg, sender, sendRes) => {
    if (!isPlainObject(msg)) return
    ;(async () => {
      if (!msg || !msg.hasOwnProperty('namespace') || msg.namespace !== namespace) return
      const results: { [methodName: string]: any } = {}
      for (const { method, args } of msg.process) {
        if (!methods.hasOwnProperty(method)) continue
        const methodRes = await methods[method](...args)
        results[method as string] = methodRes
      }
      sendRes(results)
    })()
    return true
  })
}
