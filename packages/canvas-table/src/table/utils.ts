
// 校验中文正则
const chineseReg = /[\u4e00-\u9fa5|%]/
const chineseMark = /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5|@|$]/
const numReg = /[0-9]/

export const textOverflow = (
    ctx: CanvasRenderingContext2D,
    text: string,
    width: number,
    fontSize: number,
    fontWeight: string | number,
) => {
    let str = ''
    let len = 0
    let over = false
    const zhWidth = fontSize // 中文
    // 测量数字和...的宽度
    fontWeight = fontWeight || ''
    ctx.font = `${fontWeight}  ${fontSize}px Microsoft YaHei`
    const numWidth = Math.round(ctx.measureText('0').width * 100) / 100
    const threePoint = Math.round(ctx.measureText('...').width * 100) / 100
  
    // 字段值存在 或者为 0
    text = text || (typeof text === 'number') ? text + '' : ''
    // 文字宽度
    // console.log(fontWeight, 'fontWeight')
    const tw = (Math.floor(ctx.measureText(text).width) || 1) + (fontWeight === 'bold' ? 1 : 0)
    if (text && text.length > 2 && tw > (width - len)) {
      let arr = text.split('')
      for (let i = 0, le = arr.length; i < le; i++) {
        let char = arr[i]
        if (chineseReg.test(char) || chineseMark.test(char)) {
          len += zhWidth
        } else if (numReg.test(char)) {
          len += numWidth
        } else {
          len += Math.round(ctx.measureText(char).width * 100) / 100
        }
        if (len > (width - threePoint)) {
          str += '...'
          over = true
          break
        } else {
          str += char
        }
      }
    } else {
      str = text
    }
    return {
      tw,
      over,
      text: str
    }
}

// 节流函数的类型
type Tthrottle = (func: Function, duration?: number) => Function

export const throttle: Tthrottle = (func, duration = 200) => {
    let timer: number | null = null
    return (...args: any) => {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            func.apply(this, args)
        }, duration);
    }
}
