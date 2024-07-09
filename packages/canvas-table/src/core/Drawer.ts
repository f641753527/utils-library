import { IStyle, POSITION } from '../types';
import { CanvasUtils } from '../utils';

/** 单元格绘制属性 */
interface ICellDrawProps {
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  position: POSITION;
  style: IStyle;
  /** 对齐方式 */
  align?: 'left' | 'center' | 'right';
  /** 是否为icon */
  icon?: {
    text: string;
    direction: 'left' | 'right';
    style?: IStyle;
  } | null;
  /** 是否为主字段 */
}

export default class Drawer {
  private canvasCtx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.canvasCtx = ctx;
  }

  /** 绘制单元格边框 */
  drawCellBorder(config: Omit<ICellDrawProps, 'label'>) {
    const { canvasCtx: ctx } = this;
    const { x, y, width, height, position, style } = config;
    const { borderWidth, borderColor } = style as Required<IStyle>;
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = borderColor;

    ctx.beginPath();
    switch(position) {
      case POSITION.TOP:
        ctx.moveTo(x, y + 0.5);
        ctx.lineTo(x + width, y + 0.5);
        break;
      case POSITION.BOTTOM:
        ctx.moveTo(x, y + height - 0.5);
        ctx.lineTo(x + width, y + height - 0.5);
        break;
      case POSITION.LEFT:
        ctx.moveTo(x, y + 0.5);
        ctx.lineTo(x, y + height - 0.5);
        break;
      case POSITION.RIGHT:
        ctx.moveTo(x + width, y + 0.5);
        ctx.lineTo(x + width, y + height - 0.5);
        break;
      default:
        break;
    }
    ctx.stroke();
    ctx.closePath();
  }

  /** 绘制单元格文字 */
  drawCellText (config: Omit<ICellDrawProps, 'position'>): void {
    const { canvasCtx: ctx } = this;
    const { label, x, y, width, height, style, align = 'left', icon } = config;
    const { fontSize, fontWeight, color } = style as Required<IStyle>;
    /** 文本最大绘制宽度 */
    let maxDrawWidth = width;
    /** 初始文本绘制距离左侧位置 */
    let initLeft = x;
    if (icon) {
      const { style: iconStyle, direction = 'right' } = icon;
      const { iconSize, padding: iconPadding } = (iconStyle || style) as Required<IStyle>;
      const iconWidth = iconSize + iconPadding[1] + iconPadding[3];
      maxDrawWidth = width - iconWidth;
      if (direction === 'left') {
        initLeft = x + iconWidth;
      }
    }

    ctx.font = `${fontWeight} ${fontSize}px ${'Microsoft YaHei'}`;
    ctx.fillStyle = color as string;

    const { text, width: textWidth, isOver } = CanvasUtils.textOverflow(ctx, label, maxDrawWidth, fontSize, fontWeight);
    /** 富余空间 */
    const leftWidth = isOver ? 0 : maxDrawWidth - textWidth;
    const left = align === 'left' ? initLeft : align === 'right' ? (initLeft + leftWidth) : (initLeft + leftWidth / 2);
    ctx.fillText(text, left, y + fontSize + (height - fontSize) / 2);

    /** 绘制icon */
    if (icon) {
      const { text: iconText, direction = 'right', style: iconStyle  } = icon;
      const { iconColor, iconFamily, iconSize, padding } = (iconStyle || style) as Required<IStyle>;
      ctx.font = `${fontWeight} ${iconSize}px ${iconFamily}`;
      ctx.fillStyle = iconColor;
      const left = direction === 'left' ? x + padding[3] : x + maxDrawWidth + padding[3];
      ctx.fillText(
        String.fromCharCode(parseInt(iconText.replace('&#x', ''), 16)),
        left, y + iconSize + (height - iconSize) / 2);
    }
  }

  /** 填充背景 */
  fillRect(config: Pick<ICellDrawProps, 'x' | 'y' | 'width' | 'height' | 'style'>) {
    const { canvasCtx: ctx } = this;
    const { x, y, width, height, style } = config;
    ctx.fillStyle = style.backgroundColor as string;
    ctx.fillRect(x, y, width, height);
  }

  // 擦除单元格内容
  clearCell(config: Pick<ICellDrawProps, 'x' | 'y' | 'width' | 'height'>) {
    const { canvasCtx: ctx } = this;
    const { x, y, width, height } = config;
    ctx.clearRect(x, y, width, height);
  }

  drawShadow(config: Pick<ICellDrawProps, 'x' | 'y' | 'width' | 'height' | 'style'>) {
    const { canvasCtx: ctx } = this;
    const defaultStyle = { shadowBlur: 20, shadowColor: 'rgba(0, 0, 0, 0.4)' };
    const { x, y, width, height, style } = config;

    ctx.shadowBlur = style.shadowBlur || defaultStyle.shadowBlur;
    ctx.shadowColor = style.shadowColor || defaultStyle.shadowColor;
    ctx.shadowOffsetY = 0;
    ctx.fillStyle = '#fff';
    ctx.fillRect(
      x,
      y,
      width,
      height,
    );
    ctx.shadowColor = 'rgba(0, 0, 0, 0)';
  }

}
