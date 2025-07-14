import React, { useEffect, useState } from 'react'
import Drawer from './Drawer'
import Textarea from './Textarea'
import Button from './Button'
import { isValidAddress } from '@/utils/address'
import clsxm from '@/utils/clsxm'
import { ISmartAddress } from '@/service/api/types'

interface AddWalletDrawerProps {
  isOpen: boolean
  loading: boolean
  onClose: () => void
  onAddWallet: (addresses: ISmartAddress[]) => void
}

function parseAddressString(input: string): ISmartAddress[] {
  // 按行分割输入字符串
  const lines = input.trim().split('\n')

  // 映射每行到对象
  const result: (ISmartAddress | null)[] = lines.map(line => {
    // 去除首尾空格，按空格分割
    const parts = line.trim().split(/\s+/)

    // 提取地址和别名
    const addr = parts[0]
    if (!isValidAddress(addr, 'solana')) return null
    const alias = parts[1] || '' // 如果没有别名，默认空字符串

    // 返回对象
    return {
      addr,
      source: 'Solana',
      alias
    }
  })

  return result.filter(v => v !== null)
}

function deduplicateByAddr(arr: ISmartAddress[]): ISmartAddress[] {
  return arr.reduce<ISmartAddress[]>((acc, current) => {
    // 查找是否已存在相同 addr 的对象
    const existingIndex = acc.findIndex(item => item.addr === current.addr)

    if (existingIndex !== -1) {
      acc[existingIndex] = current // 覆盖已存在的
    } else {
      acc.push(current) // 不存在则添加
    }

    return acc
  }, [])
}

const AddWalletDrawer: React.FC<AddWalletDrawerProps> = ({
  isOpen,
  loading,
  onClose,
  onAddWallet
}) => {
  const [addresses, setAddresses] = useState('')

  const [isPreview, setIsPreview] = useState(false)
  const [accounts, setAccounts] = useState<ISmartAddress[]>([])

  const handleAddressChange = (value: string) => {
    setAddresses(value)
  }

  const handlePreview = () => {
    const accounts = parseAddressString(addresses)
    setAccounts(accounts)
    setIsPreview(true)
  }

  const handleDeduplicate = () => {
    const newAccounts = deduplicateByAddr(accounts)
    setAccounts(newAccounts)
    if (!newAccounts.length) {
      setIsPreview(false)
    }
  }

  // 处理添加钱包
  const handleAddWallet = () => {
    const account = parseAddressString(addresses)
    onAddWallet(account)
  }

  useEffect(() => {
    if (!isOpen) {
      setAddresses('')
      setIsPreview(false)
      setAccounts([])
    }
  }, [isOpen])

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="导入钱包" size="lg">
      <div className="space-y-6 p-6">
        {/* 地址输入 */}
        <div>
          <Textarea
            value={addresses}
            onChange={handleAddressChange}
            label="钱包地址"
            placeholder="请输入批量导入的钱包地址，多个钱包使用换行分隔，钱包与别名之间用空格隔开"
            rows={6}
            showCounter
            // validation={{
            //   isValidating,
            //   isValid: validationResult?.isValid ?? null,
            //   message: validationResult?.message ?? ''
            // }}
            className="mb-3 w-full"
          />
          <Button
            onClick={handlePreview}
            variant="primary"
            className="w-full"
            disabled={!addresses}>
            预览
          </Button>
        </div>

        {/* 操作按钮 */}
        {isPreview && (
          <div className="space-y-3 pt-4">
            <div>
              <div className="flex justify-between border-b border-neutral-800 py-2 text-sm font-medium text-defi-text">
                <span>地址</span>
                <span>别名</span>
              </div>
              {accounts.map((account, index) => (
                <div
                  className={clsxm(
                    'flex justify-between py-2 text-sm text-defi-text-muted',
                    index !== 0 && 'border-t border-neutral-800'
                  )}>
                  <span>{account.addr}</span>
                  <span>{account.alias}</span>
                </div>
              ))}
            </div>
            <Button
              onClick={handleDeduplicate}
              variant="primary"
              className="w-full">
              一键去重、去除无效地址
            </Button>
            <Button
              onClick={handleAddWallet}
              variant="primary"
              className="w-full"
              loading={loading}
              disabled={!accounts.length}>
              导入钱包({accounts.length})
            </Button>
          </div>
        )}
      </div>
    </Drawer>
  )
}

export default AddWalletDrawer
