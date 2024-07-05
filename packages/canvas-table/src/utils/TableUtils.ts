import Table from '../core/Table';
import type { IAnyStructure, IColumnProps } from '../types';

/** 行数据 位置信息 */
export interface IRowPosInfo {
    /** 高度 */
    height: number;
    top: number;
    bottom: number;
  }
export class TableUtils {

    /** 获取列基于canvas的实际位置 */
    public static getColumnActualLeft(column: IColumnProps, table: Table, pos?: 'left' | 'right') {
        const { maxScrollX, scrollX } = table;
        const left = column._left as number;
        return pos === 'left' ? left
            : pos === 'right' ? left - maxScrollX
            : left - scrollX;
    }

    /** 获取行数据的位置信息 */
    public static getRowsPosInfo(data: IAnyStructure, rowHeight: number | ((row: IAnyStructure, i: number) => number)) :IRowPosInfo[] {
        return data.reduce((result: IRowPosInfo[], row: IAnyStructure, i: number) => {
            const height = typeof rowHeight === 'number' ? rowHeight : rowHeight(row, i);
            const top = i === 0 ? 0 : result[i - 1].bottom;
            return [...result, {
                height,
                top,
                bottom: top + height,
            }]
        }, [])
    }

    /** 获取可视区的数据 */
    public static getScreenRows(scrollY: number, height: number, rowHeights: IRowPosInfo[], data: IAnyStructure[]): IAnyStructure[]  {
        const result = [];
        for (let i = 0; i < rowHeights.length; i++) {
            const { bottom, top }  = rowHeights[i];
            /** 还未滚进可视区 */
            if (bottom < scrollY) {
                continue;
            }
            /** 底部已经滚出了可视区 */
            if (scrollY + height < top) {
                break;
            }
            /** bottom大于滚动距离 并且top小于滚动距离+表格高度 */
            result.push({
                ...data[i],
                index: i,
            });
        }
        return result;
    }
}
