import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Input from './Input'
import Select from './Select'
import MultiSelect from './MultiSelect'
import Button from './Button'
import clsxm from '@/utils/clsxm'

interface WalletMonitorFormProps {
  onSubmit: (data: WalletMonitorConfig) => void
  onBack: () => void
}

interface WalletMonitorConfig {
  name: string
  conditions: {
    operationType: string[]
    transactionAmount: string
    filterNonMainstream: string
  }
  notificationChannel: string[]
}

const WalletMonitorForm: React.FC<WalletMonitorFormProps> = ({
  onSubmit,
  onBack
}) => {
  const [formData, setFormData] = useState<WalletMonitorConfig>({
    name: '',
    conditions: {
      operationType: ['买入', '卖出', '转入', '转出'],
      transactionAmount: '10',
      filterNonMainstream: '是'
    },
    notificationChannel: ['Telegram(A)']
  })

  // 操作类型选项
  const operationTypeOptions = [
    { value: '买入', label: '买入' },
    { value: '卖出', label: '卖出' },
    { value: '转入', label: '转入' },
    { value: '转出', label: '转出' },
    { value: '首次买入', label: '首次买入' },
    { value: '首次卖出', label: '首次卖出' }
  ]

  // 是否选项
  const yesNoOptions = [
    { value: '是', label: '是' },
    { value: '否', label: '否' }
  ]

  // 通知渠道选项
  const notificationChannelOptions = [
    { value: 'Telegram(A)', label: 'Telegram(A)' },
    { value: 'Telegram(B)', label: 'Telegram(B)' },
    { value: '自定义API(A)', label: '自定义API(A)' },
    { value: '自定义API(B)', label: '自定义API(B)' }
  ]

  // 更新条件
  const updateCondition = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      conditions: { ...prev.conditions, [field]: value }
    }))
  }

  // 提交表单
  const handleSubmit = () => {
    if (!formData.name.trim()) {
      return
    }
    onSubmit(formData)
  }

  return (
    <div className="p-6 space-y-4">
      {/* 监控名称 */}
      <Input
        value={formData.name}
        onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
        label="监控名称"
        placeholder="请输入自定义监控名，例如：只监控买入卖出"
        className="w-full"
      />

      {/* 触发条件 */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-defi-text">触发条件</label>
        
        <div className="space-y-3 p-4 bg-neutral-800/30 rounded-lg border border-neutral-700">
          {/* 操作类型 */}
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-defi-text mb-1">操作类型</label>
            </div>
            <div className="flex-1">
              <MultiSelect
                value={formData.conditions.operationType}
                onChange={(value) => updateCondition('operationType', value)}
                options={operationTypeOptions}
                placeholder="请选择操作类型"
                className="w-full"
              />
            </div>
          </div>

          {/* 交易金额 */}
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-defi-text mb-1">交易金额大于</label>
            </div>
            <div className="flex-1">
              <Input
                value={formData.conditions.transactionAmount}
                onChange={(value) => updateCondition('transactionAmount', value)}
                type="number"
                suffix="$"
                className="w-full"
              />
            </div>
          </div>

          {/* 过滤非主流币种合约 */}
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-defi-text mb-1">过滤非主流币种合约</label>
            </div>
            <div className="flex-1">
              <Select
                value={formData.conditions.filterNonMainstream}
                onChange={(value) => updateCondition('filterNonMainstream', value)}
                options={yesNoOptions}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 通知渠道 */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-defi-text">通知渠道</label>
        <MultiSelect
          value={formData.notificationChannel}
          onChange={(value) => setFormData(prev => ({ ...prev, notificationChannel: value }))}
          options={notificationChannelOptions}
          placeholder="请选择通知渠道"
          className="w-full"
        />
      </div>

      {/* 操作按钮 */}
      <div className="flex space-x-3 pt-4 border-t border-neutral-800">
        <Button
          onClick={onBack}
          variant="neutral"
          className="flex-1"
        >
          上一步
        </Button>
        
        <Button
          onClick={handleSubmit}
          disabled={!formData.name.trim()}
          variant="primary"
          className="flex-1"
        >
          提交
        </Button>
      </div>
    </div>
  )
}

export default WalletMonitorForm