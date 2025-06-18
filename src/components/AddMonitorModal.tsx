import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, MessageSquare } from 'lucide-react'
import Modal from './Modal'
import WalletMonitorForm from './WalletMonitorForm'
import TwitterMonitorForm from './TwitterMonitorForm'
import toast from '@/utils/toast'

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
      description: '当钱包发生大额买入、大额卖出或者合约交互等行为时，您会收到通知。',
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
    setSelectedType(type)
    setCurrentStep('configure')
  }

  const handleWalletMonitorSubmit = (data: any) => {
    onAddMonitor('wallet', data)
    toast.success('钱包监控配置已保存')
    handleClose()
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
    if (selectedType === 'wallet') return '配置钱包监控'
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
      className="max-w-2xl"
    >
      {currentStep === 'select' && (
        <div className="p-6">
          <div className="space-y-4">
            {monitorTypes.map((monitor, index) => {
              const Icon = monitor.icon
              
              return (
                <motion.div
                  key={monitor.type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectType(monitor.type)}
                  className="relative p-6 bg-neutral-800/50 hover:bg-neutral-800/70 border border-neutral-700 hover:border-neutral-600 rounded-xl cursor-pointer transition-all duration-300 group overflow-hidden"
                >
                  {/* 背景渐变效果 */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${monitor.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  {/* 内容 */}
                  <div className="relative z-10">
                    {/* 头部 */}
                    <div className="flex items-start space-x-4 mb-4">
                      {/* 图标 */}
                      <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-r ${monitor.gradient} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-black" />
                      </div>
                      
                      {/* 标题和描述 */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-defi-text mb-2 group-hover:text-white transition-colors">
                          {monitor.title}
                        </h3>
                        <p className="text-sm text-defi-text-muted leading-relaxed">
                          {monitor.description}
                        </p>
                      </div>
                    </div>

                    {/* 示例 */}
                    <div className="p-3 bg-neutral-900/50 border border-neutral-700 rounded-lg">
                      <p className="text-xs text-defi-text-muted mb-1">示例：</p>
                      <p className="text-sm text-defi-text font-mono">
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
            className="mt-6 p-4 bg-primary-500/10 border border-primary-500/30 rounded-lg"
          >
            <p className="text-sm text-primary-400 text-center">
              💡 选择监控类型后，您可以进一步配置具体的监控参数和通知设置
            </p>
          </motion.div>
        </div>
      )}

      {currentStep === 'configure' && selectedType === 'wallet' && (
        <WalletMonitorForm
          onSubmit={handleWalletMonitorSubmit}
          onBack={handleBack}
        />
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