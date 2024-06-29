// 节流函数的类型
type Tthrottle = (func: Function, duration?: number) => Function

export const throttle: Tthrottle = (func, duration = 200) => {
    let timer: number | null = null
    return (...args: any) => {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            func.apply(this, args)
        }, duration);
    }
}