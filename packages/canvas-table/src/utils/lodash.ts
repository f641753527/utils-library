// 节流函数的类型
interface IConfig {
    /** 开始是否立即执行 */
    leading?: boolean;
    /** 结束是否再执行一次 */
    trailing?: boolean;
}

const defaultOptions = { leading: true, trailing: true };

type Tthrottle = (func: Function, interval?: number, options?: IConfig) => Function

export const throttle: Tthrottle = (fn, duration = 200, options = {}) => {
    options = Object.assign({}, defaultOptions, options)
    let timer: number | null;
    let previous = 0;
    return (...args: any) => {
        let now = +new Date();
        /** 首次触发 */
        if (previous === 0 && options.leading === false) {
            previous = now;
        }
        let remaining = duration - (now - previous);
        if (remaining < 0) {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            previous = now;
            fn.apply(this, ...args);
        } else if (!timer && options.trailing !== false) {
            /** 添加定时器 结束时触发 */
            timer = setTimeout(() => {
                previous = options.leading === false ? 0 : new Date().getTime();
                timer = null;
                fn.apply(this, ...args);
            }, remaining);
        }
    }
}
