import bs58 from 'bs58'

// 压缩 UUID 为 Base58 字符串
export function compressUUID(uuidStr: string) {
  // 移除连字符，转换为 16 字节 Buffer
  const bytes = Buffer.from(uuidStr.replace(/-/g, ''), 'hex')
  // 使用 bs58 编码
  return bs58.encode(bytes)
}

// 解压 Base58 字符串为 UUID
export function decompressUUID(base58: string) {
  // 使用 bs58 解码为 Buffer
  const bytes = bs58.decode(base58)
  // 转换为十六进制，格式化为标准 UUID
  const hex = bytes.toString('hex')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

export function makeTgToken(uuid: string, channelId: string) {
  const comUUID = compressUUID(uuid)
  return `VC${comUUID}I${channelId}`
}
