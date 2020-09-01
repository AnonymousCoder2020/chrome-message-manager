declare type IncludePromise<T> = T | Promise<T>;
export interface ConnectMethods {
    [namespace: string]: {
        [methodName: string]: (...args: any[]) => any;
    };
}
export declare type Messenger<T extends ConnectMethods, N extends keyof T, M extends keyof T[N]> = {
    namespace: N;
    process: {
        method: M;
        args: Parameters<T[N][M]>;
    }[];
};
export declare type Methods<T extends ConnectMethods, N extends keyof T> = {
    [P in keyof T[N]]: (...args: Parameters<T[N][P]>) => IncludePromise<ReturnType<T[N][P]>>;
};
export declare type ResponceType<T extends ConnectMethods, N extends keyof T> = {
    [P in keyof T[N]]?: ReturnType<T[N][P]>;
};
export declare const createRunner: <T extends ConnectMethods>() => <N extends keyof T, M extends keyof T[N]>(namespace: N, msg: Messenger<T, N, M>, methods: Methods<T, N>) => Promise<{
    [methodName: string]: any;
} | undefined>;
export declare const createSender: <T extends ConnectMethods>() => <N extends keyof T, M extends keyof T[N]>(namespace: N, process: {
    method: M;
    args: Parameters<T[N][M]>;
}[], tabId?: number | undefined) => Promise<ResponceType<T, N>>;
export declare const createReceiver: <T extends ConnectMethods>() => <N extends keyof T>(namespace: N, methods: Methods<T, N>) => void;
export {};
