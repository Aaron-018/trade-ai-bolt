import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import Modal from '@/components/Modal'
import Input from '@/components/Input'
import Button from '@/components/Button'
import clsxm from '@/utils/clsxm'
import toast from '@/utils/toast'
import { useChannelStore } from '@/store'
import { ChannelType, IChannel } from '@/service/api/types'

interface AddChannelModalProps {
  isEdit?: boolean
  isOpen: boolean
  channelData?: IChannel
  onClose: () => void
  onAddTelegramChannel: (channelName: string, channelId: string) => void
}

interface ChannelConfig {
  name: string
  type: ChannelType
  apiUrl?: string
  authorization?: string
}

const AddChannelModal: React.FC<AddChannelModalProps> = ({
  isEdit,
  isOpen,
  channelData,
  onClose,
  onAddTelegramChannel
}) => {
  const channels = useChannelStore(state => state.channels)
  const addApiChannel = useChannelStore(state => state.addApiChannel)
  const addTgChannel = useChannelStore(state => state.addTgChannel)
  const updateChannel = useChannelStore(state => state.updateChannel)

  const [formData, setFormData] = useState<ChannelConfig>({
    name: '',
    type: 'WEBHOOK',
    apiUrl: '',
    authorization: ''
  })

  useEffect(() => {
    if (isEdit && channelData) {
      const { channelName, channelType, channelConfig } = channelData
      const config = JSON.parse(channelConfig)
      const { Authorization, url } = config
      setFormData({
        name: channelName,
        type: channelType,
        apiUrl: url || '',
        authorization: Authorization || ''
      })
    }
  }, [isEdit, channelData])

  const [loading, setLoading] = useState(false)

  const channelTypes = useMemo(() => {
    if (!channels) return []
    const baseChannels = [
      {
        value: 'WEBHOOK' as ChannelType,
        label: '自定义API',
        description: '通过自定义API接口发送通知消息，支持各种webhook服务。'
      },
      {
        value: 'TELEGRAM' as ChannelType,
        label: '电报',
        description: '推荐使用Telegram，配置简单且稳定可靠。'
      }
    ]
    if (isEdit) {
      return baseChannels.filter(v => v.value === 'WEBHOOK')
    } else {
      /* return baseChannels.filter(
        v => !channels.find(channel => channel.channelType === v.value)
      ) */
      return baseChannels
    }
  }, [isEdit, channels])

  useEffect(() => {
    if (!channelTypes.length) return
    setFormData(prev => ({ ...prev, type: channelTypes[0].value }))
  }, [channelTypes])

  const changeChannelType = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isEdit) return
    setFormData(prev => ({
      ...prev,
      type: e.target.value as 'WEBHOOK' | 'TELEGRAM',
      apiUrl: '',
      authorization: ''
    }))
  }

  // 提交表单
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      return
    }

    // 如果选择自定义API，检查URL是否填写
    if (formData.type === 'WEBHOOK' && !formData.apiUrl?.trim()) {
      return
    }

    if (formData.type === 'WEBHOOK') {
      setLoading(true)
      try {
        const { name, apiUrl, authorization } = formData
        if (isEdit) {
          const channel = {
            channelId: channelData!.id,
            channelName: name,
            config: {
              url: apiUrl!,
              Authorization: authorization
            },
            unsub: false
          }
          await updateChannel(channel)
          toast.success('修改渠道成功')
        } else {
          const channel = {
            channelName: name,
            config: {
              url: apiUrl!,
              Authorization: authorization
            }
          }
          await addApiChannel(channel)
          toast.success('添加渠道成功')
        }

        handleClose()
      } catch (e) {
        toast.error(e)
      }
      setLoading(false)
    } else {
      setLoading(true)
      const channelId = await addTgChannel(formData.name)
      toast.success('添加渠道成功')
      handleClose()
      onAddTelegramChannel(formData.name, channelId)
      setLoading(false)
    }
  }

  // 关闭弹窗并重置表单
  const handleClose = () => {
    setFormData({
      name: '',
      type: channelTypes[0]?.value || 'WEBHOOK',
      apiUrl: '',
      authorization: ''
    })
    setLoading(false)
    onClose()
  }

  // 检查表单是否有效
  const isFormValid = () => {
    if (!formData.name.trim()) return false
    if (formData.type === 'WEBHOOK' && !formData.apiUrl?.trim()) return false
    return true
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? '修改通知渠道' : '添加通知渠道'}
      size="md"
      className="max-w-md">
      <div className="space-y-6 p-6">
        {/* 渠道名称 */}
        <Input
          value={formData.name}
          onChange={value => setFormData(prev => ({ ...prev, name: value }))}
          label="渠道名称"
          placeholder="请输入渠道名称"
          className="w-full"
        />

        {/* 渠道类型 */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-defi-text">
            渠道类型
          </label>

          <div className="space-y-3">
            {channelTypes.map(type => (
              <motion.label
                key={type.value}
                whileHover={{ scale: 1.01 }}
                className={clsxm(
                  'flex cursor-pointer items-start space-x-3 rounded-lg border p-4 transition-all',
                  formData.type === type.value
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-neutral-700 hover:border-neutral-600 hover:bg-neutral-800/30',
                  isEdit && 'cursor-not-allowed'
                )}>
                {/* 单选按钮 */}
                <div className="mt-0.5 flex items-center">
                  <input
                    type="radio"
                    name="channelType"
                    value={type.value}
                    checked={formData.type === type.value}
                    onChange={changeChannelType}
                    className="sr-only"
                  />
                  <div
                    className={clsxm(
                      'flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors',
                      formData.type === type.value
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-neutral-600'
                    )}>
                    {formData.type === type.value && (
                      <div className="h-2 w-2 rounded-full bg-black" />
                    )}
                  </div>
                </div>

                {/* 类型信息 */}
                <div className="flex-1">
                  <div
                    className={clsxm(
                      'mb-1 text-sm font-medium',
                      formData.type === type.value
                        ? 'text-primary-400'
                        : 'text-defi-text'
                    )}>
                    {type.label}
                  </div>
                  <p className="text-xs leading-relaxed text-defi-text-muted">
                    {type.description}
                  </p>
                </div>
              </motion.label>
            ))}
          </div>
        </div>

        {/* 自定义API URL输入框 - 仅在选择自定义API时显示 */}
        {formData.type === 'WEBHOOK' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-2">
            <Input
              value={formData.apiUrl || ''}
              onChange={value =>
                setFormData(prev => ({ ...prev, apiUrl: value }))
              }
              label="自定义API URL"
              placeholder="请输入API接口地址，例如：https://api.example.com/webhook"
              className="w-full"
            />
            <Input
              value={formData.authorization || ''}
              onChange={value =>
                setFormData(prev => ({ ...prev, authorization: value }))
              }
              label="自定义API Authorization (可选)"
              placeholder="请输入API接口 Authorization Code"
              className="w-full"
            />
            <p className="text-xs text-defi-text-muted">
              {`请确保接口支持POST请求，并能接收JSON格式([{"a":1}, {"b":2}])的通知数据`}
            </p>
          </motion.div>
        )}

        {/* 操作按钮 */}
        <div className="flex space-x-3 border-t border-neutral-800 pt-4">
          <Button onClick={handleClose} variant="neutral" className="flex-1">
            取消
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={!isFormValid()}
            loading={loading}
            variant="primary"
            className="flex-1">
            提交
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default AddChannelModal
