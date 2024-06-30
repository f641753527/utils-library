
import { EnumScrollBarDirection, IScrollBarConstructor, onDragFn } from '../types'

const scrollBarClassName = 'canvas-table-scroll-bar';

/** 滚动条 */
export default class ScrollBar {
  /** 方向 */
  private dirction: EnumScrollBarDirection = EnumScrollBarDirection.VERTICAL;
  /** 总长度 */
  private _outerLength: number = 0;
  /** 滚动条内块长度 */
  private _innerLength: number = 0;
  /** 滑块滑动距离 */
  private _offset: number = 0;
  /**  元素是否在拖动 */
  private isOnDrag: boolean = false;
  /** 鼠标初始位置 */
  private onDragMouseStartPosition: number = 0;


  /** 滚动条容器 */
  private _scrollBarBox: HTMLElement;
  /** 内部滑块 */
  private _scrollBarSlider: HTMLElement;

  private onDragSlider?: onDragFn;

  constructor(config: IScrollBarConstructor) {
    const { direction, className } = config;
    this.dirction = direction;

    const scrollBarBox = document.createElement('div');
    const posFlag = direction === EnumScrollBarDirection.VERTICAL ? '-y' : '-x';
    scrollBarBox.className = `${scrollBarClassName} ${scrollBarClassName + posFlag}`;
    if (className) {
      scrollBarBox.classList.add(className);
    }
    const scrollBarSlider = document.createElement('div');
    scrollBarSlider.className = scrollBarClassName + '--slider';
    scrollBarBox.appendChild(scrollBarSlider);
    this._scrollBarSlider = scrollBarSlider;
    this._scrollBarBox = scrollBarBox;

    if (config.onDrag) {
      this.onDragSlider = config.onDrag;
    }

    this.initEvents();
  }

  get scrollBarBox () {
    return this._scrollBarBox;
  }

  get scrollBarSlider() {
    return this._scrollBarSlider;
  }

  get outerLength() {
    return this._outerLength;
  }
  set outerLength (length: number) {
    this._outerLength = length;
    this.setSize(this._scrollBarBox, length);
  }

  set innerLength (length: number) {
    this._innerLength = length;
    this.setSize(this._scrollBarSlider, length);
  }
  get innerLength() {
    return this._innerLength;
  }

  get offset() {
    return this._offset;
  }
  set offset(offset: number) {
    this._offset = offset;
    this.setSliderOffset(offset);
  }

  private setSize(el: HTMLElement, length: number) {
    const dirction = this.dirction === EnumScrollBarDirection.VERTICAL ? 'height' : 'width';
    el.style[dirction] = length + 'px';
  }

  private setSliderOffset(offset: number) {
    const dirction = this.dirction === EnumScrollBarDirection.VERTICAL ? 'top' : 'left';
    this.scrollBarSlider.style[dirction] = offset + 'px';
  }

  private initEvents = () => {
    this._scrollBarSlider.addEventListener('mousedown', this.onMouseDown);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);

    window.onbeforeunload = () => {
      this._scrollBarSlider.removeEventListener('mousedown', this.onMouseDown);
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    }
  }

  private onMouseDown = (e: MouseEvent) => {
    this.isOnDrag = true;
    this.onDragMouseStartPosition = this.dirction === EnumScrollBarDirection.VERTICAL ? e.pageY : e.pageX;
  }

  private onMouseMove = (e: MouseEvent) => {
    if (!this.isOnDrag) return;
    const endPostion = this.dirction === EnumScrollBarDirection.VERTICAL ? e.pageY : e.pageX;
    const distance = endPostion - this.onDragMouseStartPosition;

    let offset = this.offset + distance;
    const maxOffset = this.outerLength - this.innerLength;
    offset = offset < 0 ? 0 : offset > maxOffset ? maxOffset : offset;

    this.offset = offset;
    this.onDragMouseStartPosition = endPostion;
    if (this.onDragSlider && typeof this.onDragSlider === 'function') {
      this.onDragSlider(offset, this.outerLength - this.innerLength);
    }
  }

  private onMouseUp = (e: MouseEvent) => {
    this.isOnDrag = false;
  }

}
