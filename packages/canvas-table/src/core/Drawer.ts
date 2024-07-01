import { IStyle, POSITION } from '../types';
import { textOverflow } from '../utils';

/** 单元格绘制属性 */
interface ICellDrawProps {
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  position: POSITION;
  style: IStyle;
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
        ctx.moveTo(x + width - 0.5, y + 0.5);
        ctx.lineTo(x + width - 0.5, y + height - 0.5);
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
    const { label, x, y, width, height, style } = config;
    const { fontSize, fontWeight, color, padding } = style as Required<IStyle>;

    ctx.font = `${fontWeight} ${fontSize}px ${'Microsoft YaHei'}`;
    ctx.fillStyle = color as string;

    const { text } = textOverflow(ctx, label, width - padding[1] -  padding[3], fontSize, fontWeight)

    ctx.fillText(text, x + padding[3], y + fontSize + (height - fontSize) / 2);
  }

  /** 填充背景 */
  fillRect(config: Pick<ICellDrawProps, 'x' | 'y' | 'width' | 'height' | 'style'>) {
    const { canvasCtx: ctx } = this;
    const { x, y, width, height, style } = config;
    ctx.fillStyle = style.backgroundColor as string;
    ctx.fillRect(0, 0, width, height);
  }

  // 擦除单元格内容
  clearCell(config: Pick<ICellDrawProps, 'x' | 'y' | 'width' | 'height'>) {
    const { canvasCtx: ctx } = this;
    const { x, y, width, height } = config;
    ctx.clearRect(x, y, width, height);
  }
}
