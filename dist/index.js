import { isPlainObject } from 'lodash-es';
export const createRunner = () => async (namespace, msg, methods) => {
    if (!msg || !msg.hasOwnProperty('namespace') || msg.namespace !== namespace)
        return;
    const results = {};
    for (const { method, args } of msg.process) {
        if (!methods.hasOwnProperty(method))
            continue;
        const methodRes = await methods[method](...args);
        results[method] = methodRes;
    }
    return results;
};
export const createSender = () => (namespace, process, tabId) => {
    const msg = {
        namespace,
        process,
    };
    return new Promise(resolve => {
        const callback = (res) => {
            if (isPlainObject(res))
                resolve(res);
            resolve({});
        };
        typeof tabId === 'number' ? chrome.tabs.sendMessage(tabId, msg, callback) : chrome.runtime.sendMessage(msg, callback);
    });
};
export const createReceiver = () => (namespace, methods) => {
    chrome.runtime.onMessage.addListener((msg, sender, sendRes) => {
        if (!isPlainObject(msg))
            return;
        (async () => {
            if (!msg || !msg.hasOwnProperty('namespace') || msg.namespace !== namespace)
                return;
            const results = {};
            for (const { method, args } of msg.process) {
                if (!methods.hasOwnProperty(method))
                    continue;
                const methodRes = await methods[method](...args);
                results[method] = methodRes;
            }
            sendRes(results);
        })();
        return true;
    });
};
