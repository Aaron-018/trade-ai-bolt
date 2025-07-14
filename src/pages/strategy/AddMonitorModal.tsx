import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, MessageSquare } from 'lucide-react'
import Modal from '@/components/Modal'
import WalletMonitorForm from './WalletMonitorForm'
import TwitterMonitorForm from './TwitterMonitorForm'
import toast from '@/utils/toast'
import clsxm from '@/utils/clsxm'

interface AddMonitorModalProps {
  isOpen: boolean
  onClose: () => void
  onAddMonitor: (type: 'wallet' | 'twitter', data: any) => void
}

type MonitorType = 'wallet' | 'twitter'
type ModalStep = 'select' | 'configure'

const AddMonitorModal: React.FC<AddMonitorModalProps> = ({
  isOpen,
  onClose,
  onAddMonitor
}) => {
  const [currentStep, setCurrentStep] = useState<ModalStep>('select')
  const [selectedType, setSelectedType] = useState<MonitorType | null>(null)

  // 监控类型配置
  const monitorTypes = [
    {
      type: 'wallet' as MonitorType,
      title: '钱包行为监控',
      description:
        '当钱包发生大额买入、大额卖出或者合约交互等行为时，您会收到通知。',
      example: '钱包 HhtmV_U2h（Solana）有一笔大于 10 万美元）。',
      icon: Eye,
      gradient: 'from-primary-500 to-secondary-500'
    },
    {
      type: 'twitter' as MonitorType,
      title: '推特监控',
      description: '当指定的推特账号发布新推文时，您会收到通知。',
      example: 'elonmusk 发表内容：doge doge）。',
      icon: MessageSquare,
      gradient: 'from-accent-500 to-primary-600'
    }
  ]

  const handleSelectType = (type: MonitorType) => {
    if (type === 'twitter') return
    setSelectedType(type)
    setCurrentStep('configure')
  }

  const handleTwitterMonitorSubmit = (data: any) => {
    onAddMonitor('twitter', data)
    toast.success('推特监控配置已保存')
    handleClose()
  }

  const handleBack = () => {
    setCurrentStep('select')
    setSelectedType(null)
  }

  const handleClose = () => {
    setCurrentStep('select')
    setSelectedType(null)
    onClose()
  }

  const getModalTitle = () => {
    if (currentStep === 'select') return '创建监控'
    if (selectedType === 'wallet') return '添加钱包监控'
    return '配置推特监控'
  }

  const getModalSize = () => {
    return currentStep === 'configure' ? 'xl' : 'lg'
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={getModalTitle()}
      size={getModalSize()}
      className="max-w-2xl">
      {currentStep === 'select' && (
        <div className="p-6">
          <div className="space-y-4">
            {monitorTypes.map((monitor, index) => {
              const Icon = monitor.icon
              const isDisabled = monitor.type === 'twitter'

              return (
                <motion.div
                  key={monitor.type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: isDisabled ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectType(monitor.type)}
                  className={clsxm(
                    'group relative cursor-pointer overflow-hidden rounded-xl border border-neutral-700 bg-neutral-800/50 p-6 transition-all duration-300',
                    isDisabled
                      ? 'cursor-not-allowed'
                      : 'hover:border-neutral-600 hover:bg-neutral-800/70'
                  )}>
                  {/* 背景渐变效果 */}
                  <div
                    className={clsxm(
                      'absolute inset-0 bg-gradient-to-r',
                      'opacity-0 transition-opacity duration-300',
                      isDisabled
                        ? ''
                        : `${monitor.gradient} group-hover:opacity-5`
                    )}
                  />

                  {/* 内容 */}
                  <div className="relative z-10">
                    {/* 头部 */}
                    <div className="mb-4 flex items-start space-x-4">
                      {/* 图标 */}
                      <div
                        className={`h-12 w-12 flex-shrink-0 bg-gradient-to-r ${monitor.gradient} flex items-center justify-center rounded-lg`}>
                        <Icon className="h-6 w-6 text-black" />
                      </div>

                      {/* 标题和描述 */}
                      <div className="flex-1">
                        <h3 className="mb-2 text-lg font-semibold text-defi-text transition-colors group-hover:text-white">
                          {monitor.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-defi-text-muted">
                          {monitor.description}
                        </p>
                      </div>
                    </div>

                    {/* 示例 */}
                    <div className="rounded-lg border border-neutral-700 bg-neutral-900/50 p-3">
                      <p className="mb-1 text-xs text-defi-text-muted">
                        示例：
                      </p>
                      <p className="font-mono text-sm text-defi-text">
                        {monitor.example}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* 底部提示 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 rounded-lg border border-primary-500/30 bg-primary-500/10 p-4">
            <p className="text-center text-sm text-primary-400">
              💡 选择监控类型后，您可以进一步配置具体的监控参数和通知设置
            </p>
          </motion.div>
        </div>
      )}

      {currentStep === 'configure' && selectedType === 'wallet' && (
        <WalletMonitorForm onBack={handleBack} onSuccess={handleClose} />
      )}

      {currentStep === 'configure' && selectedType === 'twitter' && (
        <TwitterMonitorForm
          onSubmit={handleTwitterMonitorSubmit}
          onBack={handleBack}
        />
      )}
    </Modal>
  )
}

export default AddMonitorModal
