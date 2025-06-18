import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Drawer from './Drawer'
import Textarea from './Textarea'
import Button from './Button'
import toast from '@/utils/toast'

interface AddWalletDrawerProps {
  isOpen: boolean
  onClose: () => void
  onAddWallet: (addresses: string[]) => void
}

const AddWalletDrawer: React.FC<AddWalletDrawerProps> = ({
  isOpen,
  onClose,
  onAddWallet
}) => {
  const [addresses, setAddresses] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean
    message: string
  } | null>(null)

  // 验证钱包地址格式
  const validateAddress = (addr: string) => {
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/
    return ethAddressRegex.test(addr.trim())
  }

  // 处理地址输入
  const handleAddressChange = (value: string) => {
    setAddresses(value)
    setValidationResult(null)
    
    if (value.length > 10) {
      setIsValidating(true)
      // 模拟验证延迟
      setTimeout(() => {
        const addressList = value.split(',').map(addr => addr.trim()).filter(addr => addr)
        const validAddresses = addressList.filter(addr => validateAddress(addr))
        const isValid = addressList.length > 0 && validAddresses.length === addressList.length
        
        setValidationResult({
          isValid,
          message: isValid 
            ? `检测到 ${addressList.length} 个有效地址` 
            : `发现 ${addressList.length - validAddresses.length} 个无效地址`
        })
        setIsValidating(false)
      }, 500)
    }
  }

  // 处理添加钱包
  const handleAddWallet = () => {
    if (!addresses.trim()) {
      toast.error('请输入钱包地址')
      return
    }

    const addressList = addresses.split(',').map(addr => addr.trim()).filter(addr => addr)
    
    if (addressList.length === 0) {
      toast.error('请输入有效的钱包地址')
      return
    }

    const validAddresses = addressList.filter(addr => validateAddress(addr))
    
    if (validAddresses.length === 0) {
      toast.error('没有找到有效的以太坊地址')
      return
    }

    if (validAddresses.length !== addressList.length) {
      toast.error(`发现 ${addressList.length - validAddresses.length} 个无效地址，请检查格式`)
      return
    }

    onAddWallet(validAddresses)
    toast.success(`成功添加 ${validAddresses.length} 个钱包`)
    
    // 重置表单
    setAddresses('')
    setValidationResult(null)
    onClose()
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="导入钱包"
      size="lg"
    >
      <div className="p-6 space-y-6">
        {/* 地址输入 */}
        <Textarea
          value={addresses}
          onChange={handleAddressChange}
          label="钱包地址"
          placeholder="请输入批量导入的钱包地址，地址间使用逗号分隔"
          rows={6}
          showCounter
          validation={{
            isValidating,
            isValid: validationResult?.isValid ?? null,
            message: validationResult?.message ?? ''
          }}
          className="w-full"
        />

        {/* 操作按钮 */}
        <div className="pt-4 border-t border-neutral-800">
          <Button
            onClick={handleAddWallet}
            disabled={!addresses || (validationResult && !validationResult.isValid)}
            variant="primary"
            className="w-full"
          >
            一键大量，去除无效地址
          </Button>
        </div>
      </div>
    </Drawer>
  )
}

export default AddWalletDrawer