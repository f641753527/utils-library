import Table from '../core/Table'
import type { IColumnProps } from '../types'

export class TableUtils {

    /** 获取列基于canvas的实际位置 */
    public static getColumnActualLeft(column: IColumnProps, table: Table, pos?: 'left' | 'right') {
        const { maxScrollX, scrollX } = table;
        const left = column._left as number;
        return pos === 'left' ? left
            : pos === 'right' ? left - maxScrollX
            : left - scrollX;
    }
}
