import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export default function clsxm(...input: ClassValue[]) {
  return twMerge(clsx(...input))
}
