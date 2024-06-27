import { IStyle, POSITION } from './types'
import { textOverflow } from './utils'


/** 画边框 */
export const drawCellBorder = (config: {
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    position: POSITION,
    style: IStyle,
}): void => {
    const { ctx, x, y, width, height, position, style } = config;
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

/** 填充单元格 */
export const drawCellText = (config: {
    ctx: CanvasRenderingContext2D,
    label: string,
    x: number,
    y: number,
    width: number,
    height: number,
    style: IStyle,
}): void => {
    const { ctx, label, x, y, width, height, style } = config
    const { fontSize, fontWeight, color, padding } = style as Required<IStyle>;

    ctx.font = `${fontWeight} ${fontSize}px ${'Microsoft YaHei'}`;
    ctx.fillStyle = color as string;

    const { text } = textOverflow(ctx, label, width - padding[1] -  padding[3], fontSize, fontWeight)

    ctx.fillText(text, x + padding[3], fontSize + (height - fontSize) / 2);
}
