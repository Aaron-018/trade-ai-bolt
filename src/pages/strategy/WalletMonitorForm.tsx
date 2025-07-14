import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Input from '@/components/Input'
import MultiSelect from '@/components/MultiSelect'
import Button from '@/components/Button'
import { useChannelStore, useStrategyStore } from '@/store'
import { IWalletStrategy } from '@/service/api/types'
import toast from '@/utils/toast'

interface WalletMonitorFormProps {
  isEdit?: boolean
  data?: IWalletStrategy
  onSuccess: () => void
  onBack?: () => void
  onCancel?: () => void
}

interface WalletMonitorConfig {
  name: string
  conditions: {
    operationType: string[]
    transactionAmount: string
  }
  notificationChannel: string[]
}

const WalletMonitorForm: React.FC<WalletMonitorFormProps> = ({
  isEdit = false,
  data,
  onSuccess,
  onBack,
  onCancel
}) => {
  const userChannels = useChannelStore(state => state.channels)
  const addWalletStrategy = useStrategyStore(state => state.addWalletStrategy)
  const updateWalletStrategy = useStrategyStore(
    state => state.updateWalletStrategy
  )

  const [loading, setLoading] = useState(false)
  const channels = useMemo(() => {
    if (!userChannels.length) return []
    const cl = userChannels.map(v => {
      return {
        label:
          v.channelType === 'TELEGRAM'
            ? `Telegram (${v.channelName})`
            : `自定义API (${v.channelName})`,
        value: v.id + ''
      }
    })
    return cl
  }, [userChannels])

  const [formData, setFormData] = useState<WalletMonitorConfig>({
    name: '',
    conditions: {
      operationType: ['BUY', 'SELL'],
      transactionAmount: '10'
    },
    notificationChannel: []
  })

  useEffect(() => {
    if (isEdit) {
      const { monitorName, operationType, minAmountUsd, notificationChannels } =
        data!
      const type = operationType.split('|').filter(v => v)
      const cls = notificationChannels.map(v => v.id + '')
      setFormData({
        name: monitorName,
        conditions: {
          operationType: type,
          transactionAmount: minAmountUsd + ''
        },
        notificationChannel: cls
      })
    }
  }, [data, isEdit])

  // 操作类型选项
  const operationTypeOptions = [
    { value: 'BUY', label: '买入' },
    { value: 'SELL', label: '卖出' }
  ]

  // 更新条件
  const updateCondition = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      conditions: { ...prev.conditions, [field]: value }
    }))
  }

  const handleCancel = () => {
    if (isEdit) {
      onCancel?.()
    } else {
      onBack?.()
    }
  }

  // 提交表单
  const handleSubmit = async () => {
    if (disabledSubmit) {
      return
    }
    try {
      setLoading(true)
      const {
        name,
        conditions: { operationType, transactionAmount },
        notificationChannel
      } = formData
      const strategy = {
        name,
        operations: operationType,
        minAmountUsd: transactionAmount,
        notifyChannelIds: notificationChannel.map(v => Number(v))
      }
      isEdit
        ? await updateWalletStrategy({
            strategyId: data!.id,
            ...strategy
          })
        : await addWalletStrategy(strategy)
      onSuccess()
      toast.success('Success')
    } catch (e) {
      toast.error(e)
    }
    setLoading(false)
  }

  const disabledSubmit =
    !formData.name.trim() ||
    !formData.conditions.operationType.length ||
    !formData.conditions.transactionAmount ||
    !formData.notificationChannel.length

  return (
    <div className="space-y-4 p-6">
      {/* 监控名称 */}
      <Input
        value={formData.name}
        onChange={value => setFormData(prev => ({ ...prev, name: value }))}
        label="监控名称"
        placeholder="请输入自定义监控名，例如：只监控买入卖出"
        className="w-full"
      />

      {/* 触发条件 */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-defi-text">
          触发条件
        </label>

        <div className="space-y-3 rounded-lg border border-neutral-700 bg-neutral-800/30 p-4">
          {/* 操作类型 */}
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-defi-text">
                操作类型
              </label>
            </div>
            <div className="flex-1">
              <MultiSelect
                value={formData.conditions.operationType}
                onChange={value => updateCondition('operationType', value)}
                options={operationTypeOptions}
                placeholder="请选择操作类型"
                className="w-full"
              />
            </div>
          </div>

          {/* 交易金额 */}
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-defi-text">
                交易金额大于
              </label>
            </div>
            <div className="flex-1">
              <Input
                value={formData.conditions.transactionAmount}
                onChange={value => updateCondition('transactionAmount', value)}
                type="number"
                suffix="$"
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
          onChange={value =>
            setFormData(prev => ({ ...prev, notificationChannel: value }))
          }
          options={channels}
          placeholder="请选择通知渠道"
          className="w-full"
          extraOptions={() => (
            <div className="flex justify-center py-1">
              <Link
                to="/channel"
                className="text-sm text-primary-400 hover:opacity-70">
                添加渠道
              </Link>
            </div>
          )}
        />
      </div>

      {/* 操作按钮 */}
      <div className="flex space-x-3 border-t border-neutral-800 pt-4">
        <Button onClick={handleCancel} variant="neutral" className="flex-1">
          {isEdit ? '取消' : '上一步'}
        </Button>

        <Button
          onClick={handleSubmit}
          loading={loading}
          disabled={disabledSubmit}
          variant="primary"
          className="flex-1">
          提交
        </Button>
      </div>
    </div>
  )
}

export default WalletMonitorForm
