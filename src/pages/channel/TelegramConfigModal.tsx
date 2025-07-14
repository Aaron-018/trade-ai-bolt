import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import Modal from '@/components/Modal'
import Button from '@/components/Button'
import Copy from '@/components/Copy'
import clsxm from '@/utils/clsxm'
import toast from '@/utils/toast'
import { useUserStore } from '@/store'
import { makeTgToken } from '@/store/makeTgToken'
import addAdmin from '@/assets/img/add-amin.png'
import bindGroup from '@/assets/img/bind-group.png'
import { testTgSend } from '@/service/api'

interface TelegramConfigModalProps {
  isOpen: boolean
  onClose: () => void
  channelName: string
  channelId: string
}

type TabType = 'personal' | 'group'

const botName = 'tradeAIIIIIIIBot'
const TelegramConfigModal: React.FC<TelegramConfigModalProps> = ({
  isOpen,
  onClose,
  channelName,
  channelId
}) => {
  const userInfo = useUserStore(state => state.userInfo)

  const [activeTab, setActiveTab] = useState<TabType>('personal')

  const tgToken = useMemo(() => {
    if (!userInfo || !channelId) return ''
    const uuid = Object.values(userInfo)[0] || ''
    return makeTgToken(uuid, channelId)
  }, [userInfo, channelId])

  // Tab配置
  const tabs = [
    { key: 'personal' as TabType, label: '绑定到个人' },
    { key: 'group' as TabType, label: '绑定到群组' }
  ]

  // 处理测试发送
  const handleTestSend = async () => {
    try {
      await testTgSend(channelId)
    } catch (e) {
      toast.error(e)
    }
  }
  const bindGroupText = `@${botName} /bind ${tgToken}`

  // 渲染个人配置步骤
  const renderPersonalSteps = () => (
    <div className="space-y-6">
      {/* 步骤1 */}
      <div className="space-y-3">
        <div className="flex items-center space-x-4">
          <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-black">
            1
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-defi-text">打开Telegram桌面端</h3>
          </div>
        </div>
        <div className="pl-9">
          <Button
            onClick={() =>
              window.open(`https://t.me/${botName}?start=${tgToken}`, '_blank')
            }
            variant="primary"
            className="flex items-center space-x-2">
            <span>点此自动跳转Telegram桌面端</span>
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 步骤2 */}
      <div className="flex items-center space-x-4">
        <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-black">
          2
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-defi-text">
            点击START绑定到个人聊天窗口
          </h3>
        </div>
      </div>

      {/* 步骤3 */}
      <div className="space-y-3">
        <div className="flex items-center space-x-4">
          <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-black">
            3
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-defi-text">
              绑定完成后，可以看到success字样，后续添加通道时可以选择该通道进行交易通知了
            </h3>
          </div>
        </div>
        <div className="pl-9">
          <Button onClick={handleTestSend} variant="primary">
            测试发送
          </Button>
        </div>
      </div>
    </div>
  )

  // 渲染群组配置步骤
  const renderGroupSteps = () => (
    <div className="space-y-6">
      {/* 步骤1 */}
      <div className="flex items-center space-x-4">
        <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-black">
          1
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-defi-text">
            在您的Telegram群组中添加
            <span className="mx-1 font-mono text-primary-400">@{botName}</span>
            <Copy text={`@${botName}`} />
          </h3>
        </div>
      </div>

      {/* 步骤2 */}
      <div className="space-y-3">
        <div className="flex items-center space-x-4">
          <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-black">
            2
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-defi-text">
              添加进群后，设置管理员权限
            </h3>
          </div>
        </div>
        <div className="pl-9">
          <div className="h-72 w-full">
            <img src={addAdmin} alt="" className="h-full object-cover" />
          </div>
        </div>
      </div>

      {/* 步骤3 */}
      <div className="space-y-3">
        <div className="flex items-center space-x-4">
          <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-black">
            3
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-defi-text">
              然后在群里发送
              <span className="mx-1 font-mono text-primary-400">
                {bindGroupText}
              </span>
              <Copy text={bindGroupText} />
            </h3>
          </div>
        </div>
        {/* 占位图片 */}
        <div className="pl-9">
          <div className="h-36">
            <img className="h-full object-cover" src={bindGroup} alt="" />
          </div>
        </div>
      </div>

      {/* 步骤4 */}
      <div className="flex space-x-4">
        <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-black">
          4
        </div>
        <div className="flex-1">
          <h3 className="mb-3 font-semibold text-defi-text">
            绑定完成后，可以看到success字样，后续添加通知时可以选择该通知渠道接受交易通知了
          </h3>
          <Button onClick={handleTestSend} variant="primary">
            测试发送
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`渠道 ${channelName} - 绑定Telegram`}
      size="xl"
      className="max-w-2xl">
      <div className="max-h-[700px] overflow-auto p-6">
        {/* Tab导航 */}
        <div className="mb-6">
          <div className="flex space-x-1 rounded-lg bg-neutral-800/50 p-1">
            {tabs.map(tab => (
              <motion.button
                key={tab.key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.key)}
                className={clsxm(
                  'relative flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all',
                  activeTab === tab.key
                    ? 'bg-primary-500 text-black'
                    : 'text-defi-text-muted hover:bg-neutral-700/50 hover:text-defi-text'
                )}>
                {tab.label}
                {activeTab === tab.key && (
                  <div
                    // layoutId="telegramActiveTab"
                    className="absolute inset-0 -z-10 rounded-lg bg-primary-500"
                    // transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* 内容区域 */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}>
          {activeTab === 'personal'
            ? renderPersonalSteps()
            : renderGroupSteps()}
        </motion.div>
      </div>
    </Modal>
  )
}

export default TelegramConfigModal
