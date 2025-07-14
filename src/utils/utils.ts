import { BigNumber } from 'bignumber.js'

const MODE = import.meta.env.MODE

export const isBeta = MODE === 'beta'

export function addZero(num: number | string) {
  return Number(num) > 9 ? num : '0' + num
}

export function toThousands(num: string | number) {
  if (!num) return num === 0 ? '0' : ''
  const N = num.toString().split('.')
  const int = N[0]
  const float = N[1] ? '.' + N[1] : ''
  return int.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + float
}

type Big = BigNumber | string | number
export const Power = (arg: Big) => {
  const newPower = new BigNumber(10)
  return newPower.pow(arg)
}

export const Plus = (nu: Big, arg: Big) => {
  const newPlus = new BigNumber(nu)
  return newPlus.plus(arg)
}

export const Minus = (nu: Big, arg: Big) => {
  const newMinus = new BigNumber(nu)
  return newMinus.minus(arg)
}

export const Times = (nu: Big, arg: Big) => {
  const newTimes = new BigNumber(nu)
  return newTimes.times(arg)
}

export const Division = (nu: Big, arg: Big) => {
  const newDiv = new BigNumber(nu)
  return newDiv.div(arg)
}

export const timesDecimals = (nu: Big, decimals = 8) => {
  return new BigNumber(Times(nu, Power(decimals.toString()).toString()))
    .toFormat()
    .replace(/[,]/g, '')
}

export const divisionDecimals = (nu: Big, decimals = 8) => {
  if (!nu) return ''
  return new BigNumber(Division(nu, Power(decimals.toString()).toString()))
    .toFormat()
    .replace(/[,]/g, '')
}

export function divisionAndFix(nu: Big, decimals = 8, fix = 6) {
  if (!nu) return '0'
  const newFix = fix ? fix : Number(decimals)
  const str = new BigNumber(Division(nu, Power(decimals))).toFixed(newFix)
  return fixNumber(str, newFix)
}

export function fixNumber(str: string | number, fix = 8) {
  str = '' + str
  const int = str.split('.')[0]
  let float = str.split('.')[1]
  if (!float || !Number(float)) return int
  float = float.slice(0, fix).replace(/(0+)$/g, '')
  return Number(float) ? int + '.' + float : int
}

export const superLong = (str: string, len = 8) => {
  if (str && str.length > 10) {
    return (
      str.substr(0, len) + '....' + str.substr(str.length - len, str.length)
    )
  } else {
    return str
  }
}

export const formatOptions = (str: string) => {
  return str.split('|').filter(v => v)
}

export function formatNumber(num: string | number, fix = 8) {
  const B = 1000000000
  const M = 1000000
  const K = 1000
  if (Minus(num, B).toNumber() >= 0) {
    return Division(num, B).toFixed(2) + 'B'
  } else if (Minus(num, M).toNumber() >= 0) {
    return Division(num, M).toFixed(2) + 'M'
  } else if (Minus(num, K).toNumber() >= 0) {
    return Division(num, K).toFixed(2) + 'K'
  } else {
    return fixNumber(num.toString(), fix)
  }
}
