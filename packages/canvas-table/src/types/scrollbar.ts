/** 滚动条方向 */
export enum EnumScrollBarDirection {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
}

/** 
  * @description 滚动条拖动事件
  * @param { number } 滑块偏移量
  * @param { number } 滚动条总长度
  */
export type onDragFn =  (offset: number, maxOffset: number) => void;

/** 滚动条构造器参数 */
export interface IScrollBarConstructor {
  direction: EnumScrollBarDirection;
  className?: string;
  onDrag?: onDragFn;
}
