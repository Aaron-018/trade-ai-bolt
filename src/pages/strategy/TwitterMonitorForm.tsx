import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Input from '@/components/Input'
import MultiSelect from '@/components/MultiSelect'
import Select from '@/components/Select'
import Button from '@/components/Button'
import clsxm from '@/utils/clsxm'

interface TwitterMonitorFormProps {
  onSubmit: (data: TwitterMonitorConfig) => void
  onBack: () => void
}

interface TwitterMonitorConfig {
  name: string
  username: string
  monitorType: string[]
  notificationChannel: string
}

const TwitterMonitorForm: React.FC<TwitterMonitorFormProps> = ({
  onSubmit,
  onBack
}) => {
  const [formData, setFormData] = useState<TwitterMonitorConfig>({
    name: '',
    username: '',
    monitorType: ['发推', '转推', '改名', '改头像', '改简介', '改网站'],
    notificationChannel: 'Telegram(A)'
  })

  // 监控类型选项
  const monitorTypeOptions = [
    { value: '发推', label: '发推' },
    { value: '转推', label: '转推' },
    { value: '改名', label: '改名' },
    { value: '改头像', label: '改头像' },
    { value: '改简介', label: '改简介' },
    { value: '改网站', label: '改网站' }
  ]

  // 通知渠道选项（删除了debot选项）
  const notificationChannelOptions = [
    { value: 'Telegram(A)', label: 'Telegram(A)' },
    { value: 'Telegram(B)', label: 'Telegram(B)' },
    { value: '自定义API(A)', label: '自定义API(A)' },
    { value: '自定义API(B)', label: '自定义API(B)' }
  ]

  // 提交表单
  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.username.trim()) {
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
        placeholder="请输入自定义监控名，例如：马斯克推特"
        className="w-full"
      />

      {/* 推特用户名 */}
      <Input
        value={formData.username}
        onChange={(value) => setFormData(prev => ({ ...prev, username: value }))}
        label="推特用户名"
        placeholder="请输入单个推特用户名，不含@"
        className="w-full"
      />

      {/* 监控类型 - 减少间距 */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-defi-text">监控类型</label>
        <MultiSelect
          value={formData.monitorType}
          onChange={(value) => setFormData(prev => ({ ...prev, monitorType: value }))}
          options={monitorTypeOptions}
          placeholder="请选择监控类型"
          className="w-full"
        />
      </div>

      {/* 通知渠道 */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-defi-text">通知渠道</label>
        <Select
          value={formData.notificationChannel}
          onChange={(value) => setFormData(prev => ({ ...prev, notificationChannel: value }))}
          options={notificationChannelOptions}
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
          disabled={!formData.name.trim() || !formData.username.trim()}
          variant="primary"
          className="flex-1"
        >
          提交
        </Button>
      </div>
    </div>
  )
}

export default TwitterMonitorForm