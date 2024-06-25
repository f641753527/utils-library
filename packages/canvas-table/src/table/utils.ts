/** 划一条线 */
export const ctxDrawLine = (
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    endX: number,
    endY: number
): void => {
     ctx.beginPath();
     ctx.moveTo(startX, startY);
     ctx.lineTo(endX, endY);
     ctx.stroke();
     ctx.closePath();
}
