import Table from '../core/Table';
import { LodashUtils } from './LodashUtils';
import type { IAnyStructure, IColumnProps, IStyle, ITableCellMouseEvent } from '../types';

/** 行数据 位置信息 */
export interface IRowPosInfo {
    /** 高度 */
    height: number;
    top: number;
    bottom: number;
  }
export class TableUtils {

    /** 获取列基于canvas的实际位置 */
    public static getColumnActualLeft(column: IColumnProps, scrollX: number, maxScrollX: number, pos?: 'left' | 'right') {
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

    /** 获取鼠标事件对应的单元格 */
    public static getMouseEventCell(e: MouseEvent, context: Table): ITableCellMouseEvent | null {
        const { data, columns, scrollX, maxScrollX, scrollY, canvas, fixedLeftWidth, fixedRightWidth,
            headerHight, maxHeaderDepth, rowHeights,
        } = context;

        const { offsetX, offsetY } = e;

        /** 表头总高度 */
        const headerTotalHeight = headerHight * maxHeaderDepth;
        /** 事件是否触发在表头 */
        const isOverHeader = offsetY < headerTotalHeight;

        const _columns: IColumnProps[] = [];
        LodashUtils.BFS(columns, { callback: (col, depth) => {
            _columns.push(col as IColumnProps);
        }});
    
        /** 实际距离canvas左侧距离 */
        let actualLeft = offsetX;
        /** 点击右侧fixed区域 需要加上滚动隐藏部分 */
        if (offsetX > canvas.width - fixedRightWidth) {
            actualLeft += maxScrollX;
        } else if (offsetX > fixedLeftWidth) {
            /** 点击中间部门 需要加上滚动距离 */
            actualLeft += scrollX;
        }
    
        const col = _columns.find(c =>
            actualLeft > (c._left as number) &&
            actualLeft < (c._left as number) + (c._realWidth as number) &&
            /** 事件在表头 则需要判断左右位置 还要判断上下位置 */
            (isOverHeader
                ? (offsetY > (c._top as number) && offsetY < (c._top as number) + 
                    (c.children && c.children.length ? headerHight : c._height as number))
                /** 事件在body 则找叶子节点 */
                : (!c.children || !c.children.length)
            )
        );
    
        const actualTop = offsetY - headerTotalHeight + scrollY;
        const rowIndex = data.findIndex((_, i) => {
            const { height, top } = rowHeights[i];
            return actualTop > top && actualTop < (top + height);
        });
        if (!col) return null;
        if (isOverHeader) {
            return {
                isHeader: true,
                col,
                left: TableUtils.getColumnActualLeft(col, scrollX, maxScrollX, col.fixed),
                width: (col._realWidth as  number),
                top: col._top as number,
                height: col._height as number,
            }
        }
        if (rowIndex === -1) return null;
        const row = data[rowIndex];
        const { height, top } = rowHeights[rowIndex];
        return {
            rowIndex,
            row,
            col,
            left: TableUtils.getColumnActualLeft(col, scrollX, maxScrollX, col.fixed),
            width: (col._realWidth as  number),
            top: top + headerTotalHeight - scrollY,
            height,
        }
    }

    /** 获取渲染formatter 单项的padding */
    public static getFormatterItemPadding(baseStyle: IStyle, itemStyle: IStyle = {}, index: number, length: number) {
        const { padding } = baseStyle as Required<IStyle>;

        let formatterItemPadding = itemStyle.padding || [0, 0, 0, 0];

        if (!itemStyle.padding && index === 0) {
            formatterItemPadding[3] = padding[3];
        }
        if (!itemStyle.padding && index === length - 1) {
            formatterItemPadding[1] = padding[1];
        }
        return formatterItemPadding
    }

    public static getFormatterItemIconWidth(icon: any, style: IStyle) {
        let iconWidth = 0;
        if (icon) {
            const { style: iconStyle } = icon;
            const iconCombinedStyle = { ...style, ...(iconStyle || {}) } as Required<IStyle>;
            iconWidth += iconCombinedStyle.iconSize;
            if (iconStyle?.padding) {
                iconWidth += (iconStyle.padding[1] + iconStyle.padding[3]);
            }
        }
        return iconWidth;
    }
}
