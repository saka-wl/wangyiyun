// 毫秒变 00:00
export function handleTime(time) {
  let min = Math.floor(time / 60)
    .toString()
    .padStart(2, '0')
  let sec = (time - min * 60).toString().padStart(2, '0')
  return {
    min,
    sec
  }
}

// [00:00.000] 变 毫秒
export function resolveTime(timeStr) {
  let timesArr = timeStr.split(':')
  return parseInt(timesArr[0]) * 60 + parseFloat(timesArr[1])
}

// 时间戳变日期（2022-12-12 12：12：12）
export function getTime(data) {
  let time = new Date(data)
  let Y = time.getFullYear() + '-'
  let M = (time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1) + '-'
  let D = time.getDate() + ' '
  let h = time.getHours() + ':'
  let m = time.getMinutes() + ':'
  let s = time.getSeconds()
  return Y+M+D+h+m+s
}
