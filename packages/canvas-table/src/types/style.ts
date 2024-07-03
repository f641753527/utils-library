/** 基础样式类 */
interface baseStyle {
  padding?: [number, number, number, number];
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  color?: string;
  fontSize?: number;
  fontWeight?: string | number;
  primary?: string;
  shadowColor?: string;
  shadowBlur?: number;
}

/** CanvasTable 样式 */
export interface IStyle extends baseStyle {
  header?: baseStyle;
  summary?: baseStyle;
}