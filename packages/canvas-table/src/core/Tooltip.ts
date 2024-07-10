import { Singleton } from '../utils'

const tooltipClassName = 'canvas-table--tooltip';

interface ITooltipState {
    left?: number;
    top?: number;
    content?: string;
    parentWidth?: number;
    parentHeight?: number;
    postion?: 'top' | 'bottom';
}

/** 气泡 */
export default class Tooltip extends Singleton {

    private tooltipDomEl: HTMLElement | null = null;

    private left: number = 0;
    private top: number = 0;
    private content: string = '';
    /** 依附定位元素的宽 */
    private parentWidth: number = 0;
    private parentHeight: number = 0;
    private postion: 'top' | 'bottom' = 'bottom';

    constructor() {
        super();
        this.init();
    }

    public init() {
        if (this.tooltipDomEl) return;
        const tooltipDomEl = document.createElement('div');
        tooltipDomEl.style.display = 'none';
        tooltipDomEl.className = tooltipClassName;
        const tooltipArrowEl = document.createElement('div');
        tooltipArrowEl.className = tooltipClassName + '__arrow';
        
        const tooltipContentEl = document.createElement('div');
        tooltipContentEl.className = tooltipClassName + '__content';

        tooltipDomEl.appendChild(tooltipContentEl);
        tooltipDomEl.appendChild(tooltipArrowEl);

        this.tooltipDomEl = tooltipDomEl;
        document.body.appendChild(tooltipDomEl);
    }



    public remove() {
        this.tooltipDomEl?.parentNode?.removeChild(this.tooltipDomEl);
        setTimeout(() => {
            this.tooltipDomEl = null;
        }, 500);
    }

    public hide() {
        if (this.tooltipDomEl === null) return;
        this.tooltipDomEl.style.display = 'none';
    }

    public setState(state: ITooltipState) {
        Object.keys(state).forEach((key) => {
            ((this as any)[key]) = state[key as keyof ITooltipState];
        })
    }

    public show() {
        setTimeout(() => {
            if (!this.tooltipDomEl) return;
            const contentEl = this.tooltipDomEl.querySelector('.' + tooltipClassName + '__content');
            if (!contentEl) return;
            const { left, top, content, parentWidth, parentHeight, postion } = this;

            contentEl.innerHTML = content;
            this.tooltipDomEl.setAttribute('x-placement', postion);

            const width = contentEl.clientWidth + 16;
            const height = contentEl.clientHeight + 16;

            const _left = left + (parentWidth - width) / 2;
            const _top = postion === 'top' ? top - height - 6 : top + parentHeight + 6;

            this.tooltipDomEl.style.top = _top + 'px';
            this.tooltipDomEl.style.left = _left + 'px';

            this.tooltipDomEl.style.display = 'block';
        }, 60);
    }

}
