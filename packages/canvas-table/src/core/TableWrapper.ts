import { TableWrapperConstructor, ITableAttrs, EnumScrollBarDirection } from '../types';
import Table from './Table';
import ScrollBar from './ScrollBar';
import { defaultTableAttrs } from './const';

export default class CanvasTableWrapper {
  private el: HTMLElement;
  private table: Table;
  private scrollBarY: ScrollBar;

  constructor(options: TableWrapperConstructor) {
    let { el = document.body, ...tableAttrs } = options;

    /** canvas table 挂载的el节点 */
    this.el = el;

    /** 纵向滚动条 */
    this.scrollBarY = new ScrollBar({ direction: EnumScrollBarDirection.VERTICAL })

    /** table  属性 */
    const combinedTableAttrs = { ...defaultTableAttrs, ...tableAttrs, };
    /** 表格实例 */
    this.table = new Table(combinedTableAttrs);

    this.onMount();
    this.initEvents();
    
  }

  /** el 节点挂载 */
  onMount = () => {
    const { el, scrollBarY, table } = this;

    const image = new Image();
    image.onload = () => {
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
    }
    image.src = 'https://inews.gtimg.com/om_bt/OGlQWfsaAoKkuCcMZ2o9IVEPqd-72DQy5EAN02XBHUwfYAA/641'
  }

  private init() {
    this.table.init();
    this.table.draw();
    this.initScrollBarY();
    this.initEvents();
  }

  private initScrollBarY() {
    const { sourceData, rowHeight, headerHight } = this.table;
    /** tBody总高 */
    const height = this.table.canvas.height - headerHight;

    /** 滚动条内部块占总高度占比 */
    const scrollBarRate = height / ((sourceData.length  * rowHeight) || height);
    /** 滚动条 内部块高度 */
    const scrollBarHeight = scrollBarRate * height;

    const maxScrollDistance = (1 - scrollBarRate) * (sourceData.length  * rowHeight);

    this.scrollBarY.outerLength = height;
    this.scrollBarY.innerLength = scrollBarHeight;
    this.scrollBarY.maxScrollDistance = maxScrollDistance;
  }


  private initEvents() {
    this.table.canvas.addEventListener('wheel', this.onWheel, { passive: false })
  }

  /** 鼠标滚轮 */
  private onWheel = (e: WheelEvent) => {
    const { deltaX, deltaY } = e;
    // 判断是横向滚动还是纵向滚动
    const isHScroll = Math.abs(deltaX) > Math.abs(deltaY);
    const { maxScrollDistance, scrollDistance } = this.scrollBarY;

    if (
      !isHScroll &&
      ((deltaY > 0 && scrollDistance < maxScrollDistance) ||
        (deltaY < 0 && scrollDistance > 0)
      )
    ) {
      e.preventDefault();
      let scrollY = scrollDistance + deltaY;
      scrollY = scrollY < 0 ? 0 : (scrollY > maxScrollDistance ? maxScrollDistance : scrollY);
      this.scrollBarY.scrollDistance = scrollY;
      this.table.scrollY = scrollY;
      this.table.draw();
    }
  }

}
