import { TableWrapperConstructor, EnumScrollBarDirection, IAnyStructure } from '../types';
import Table from './Table';
import ScrollBar from './ScrollBar';
import { defaultTableAttrs } from './const';

export default class CanvasTableWrapper {
  private querySelector: string;
  private el: HTMLElement | null;
  private table: Table;
  private scrollBarY: ScrollBar;

  constructor(options: TableWrapperConstructor) {
    let { el, ...tableAttrs } = options;

    this.querySelector = el;

    /** canvas table 挂载的el节点 */
    this.el = document.querySelector(el);

    /** 纵向滚动条 */
    this.scrollBarY = new ScrollBar({
      direction: EnumScrollBarDirection.VERTICAL,
      onDrag: this.onScrollBarYDrag,
    })

    /** 表格实例 */
    this.table = new Table({
      ...defaultTableAttrs,
      ...tableAttrs,
      onWheel: this.onCanvasWheel,
    });

    this.onMount();
  }

  /** el 节点挂载 */
  onMount = () => {
    if (!this.el) {
      document.addEventListener('DOMContentLoaded', () => {
        this.el = document.querySelector(this.querySelector);
        if (!this.el) {
          throw new Error('找不到挂在节点')
        }
        this.createTableEl();
      })
    } else {
      this.createTableEl();
    }
  }

  private createTableEl() {
    const { scrollBarY, table } = this;
    const el = this.el as HTMLElement;

    console.log('el节点已挂载, 宽度: ', el.clientWidth);
    const tableWrapperEl = document.createElement('div');
    tableWrapperEl.style.position = 'relative';
    tableWrapperEl.style.fontSize = '0';
    table.clientWidth = el.clientWidth;
    tableWrapperEl.appendChild(table.canvas);
    tableWrapperEl.appendChild(scrollBarY.scrollBarBox);
    el.appendChild(tableWrapperEl);
    /** 初始化表格配置 */
    this.init();
    tableWrapperEl.style.width = table.canvas.width + 'px';
    el.style.width = table.canvas.width + 'px';
  }

  private init() {
    this.table.init();
    this.table.draw();
    this.initScrollBarY();
    this.initEvents();
  }

  private initScrollBarY() {
    const { headerHight, maxScrollY, canvas } = this.table;
    this.scrollBarY.scrollBarBox.style.display = maxScrollY <= 0 ? 'none' : 'block';
    if (maxScrollY <= 0) {
      return
    }
    /** tBody总高 */
    const height = canvas.height - headerHight;

    /** 滚动条内部块占总高度占比 */
    const scrollBarRate = height / ((height + maxScrollY) || Infinity);
    /** 滚动条 内部块高度 */
    const scrollBarHeight = scrollBarRate * height;

    this.scrollBarY.outerLength = height;
    this.scrollBarY.innerLength = scrollBarHeight;
  }

  private onScrollBarYDrag = (offset: number, maxOffset: number) => {
    const { maxScrollY } = this.table;
    this.table.scrollY = maxScrollY * (offset / (maxOffset || Infinity));
    this.table.draw();
  }

  private onCanvasWheel = (scrollDistance: number, maxScrollDistance: number) => {
    const { outerLength, innerLength } = this.scrollBarY;
    this.scrollBarY.offset = (scrollDistance / (maxScrollDistance || Infinity)) * (outerLength - innerLength);
  }

  private initEvents() {
  }

  public setData(data: IAnyStructure[]) {
    this.table.setState(data);
    this.table.draw();
    this.scrollBarY.offset = 0;
    this.initScrollBarY();
  }
}
