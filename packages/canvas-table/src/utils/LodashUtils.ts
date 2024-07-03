import { IAnyStructure } from "../types";

// 节流函数的类型
interface IConfig {
    /** 开始是否立即执行 */
    leading?: boolean;
    /** 结束是否再执行一次 */
    trailing?: boolean;
}

interface IBFSProps {
    childKey?: string;
    /** 遍历子元素之前执行 */
    callback?: (node: IAnyStructure, depth: number) => void;
}

/**
 * @description lodash 工具类
*/
export class LodashUtils {

    public static readonly DEFAULT_OPTIONS: IConfig = { leading: true, trailing: true };

    public static throttle(fn: Function, interval = 200, config?: IConfig): Function {
        const options = Object.assign({}, LodashUtils.DEFAULT_OPTIONS, config || {})
        let timer: number | null;
        let previous = 0;
        return (...args: any) => {
            let now = +new Date();
            /** 首次触发 */
            if (previous === 0 && options.leading === false) {
                previous = now;
            }
            let remaining = interval - (now - previous);
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

    public static BFS(tree: IAnyStructure[], props?: IBFSProps) {
        const defaultProps: IBFSProps = {
            childKey: 'children',
        };

        const options = Object.assign({}, defaultProps, props || {})
        const { childKey, callback } = options as Required<IBFSProps>;

        const isValidCallback = callback && typeof callback === 'function';

        const dps = (nodes: IAnyStructure[], depth: number) => {
            for (const node of nodes) {
                if (node[childKey] && node[childKey].length) {
                    dps(node[childKey], depth + 1);
                }
                isValidCallback && callback(node, depth);
            }
        }
        dps(tree, 0);
    }
}
