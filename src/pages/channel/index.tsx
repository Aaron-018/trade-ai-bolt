import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, CheckCircle, XCircle } from 'lucide-react'
import Button, { AuthButton } from '@/components/Button'
import ChannelItem from './ChannelItem'
import AddChannelModal from './AddChannelModal'
import TelegramConfigModal from './TelegramConfigModal'
import { useChannelStore } from '@/store'
import useAuth from '@/hooks/useAuth'
import toast from '@/utils/toast'
import { IChannel } from '@/service/api/types'

const Channel = () => {
  const channels = useChannelStore(state => state.channels)
  const setChannels = useChannelStore(state => state.setChannels)
  const getChannels = useChannelStore(state => state.getChannels)
  const updateChannel = useChannelStore(state => state.updateChannel)
  const deleteChannel = useChannelStore(state => state.deleteChannel)
  const hasAuth = useAuth()
  const [editMode, setEditMode] = useState({
    status: false,
    data: {} as IChannel
  })

  useEffect(() => {
    if (hasAuth) {
      getChannels()
    } else {
      setChannels([])
    }
  }, [hasAuth, getChannels, setChannels])

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const [showTelegramModal, setShowTelegramModal] = useState(false)
  const [tgChannelInfo, setTgChannelInfo] = useState({
    channelName: '',
    channelId: ''
  })

  const handleModalClose = () => {
    setIsAddModalOpen(false)
    setEditMode({
      status: false,
      data: {} as IChannel
    })
  }

  const handleEditChannelName = (channel: IChannel, channelName: string) => {
    const newItems = channels.map(v => {
      if (v.id === channel.id) {
        return { ...channel, channelName }
      } else {
        return v
      }
    })
    setChannels(newItems)
  }

  const saveChannelName = async (channel: IChannel) => {
    try {
      const { id, channelName, channelConfig } = channel
      const newChannel = {
        channelId: id,
        channelName,
        config: JSON.parse(channelConfig),
        unsub: false
      }
      await updateChannel(newChannel)
      toast.success('Success')
      return true
    } catch (e) {
      toast.error(e)
    }
    return false
  }

  const openEditModal = (channel: IChannel) => {
    if (channel.channelType === 'WEBHOOK') {
      setEditMode({
        status: true,
        data: channel
      })
      setIsAddModalOpen(true)
    } else {
      setTgChannelInfo({
        channelName: channel.channelName,
        channelId: channel.id + ''
      })
      setShowTelegramModal(true)
    }
  }

  // 删除渠道
  const handleDeleteChannel = async (channel: IChannel) => {
    try {
      await deleteChannel(channel)
      toast.success(`已删除 ${channel.channelName}`)
    } catch (e) {
      toast.error(e)
    }
  }

  const onAddTelegramChannel = (channelName: string, channelId: string) => {
    setTgChannelInfo({ channelName, channelId })
    setShowTelegramModal(true)
  }

  // 统计数据
  const stats = {
    total: channels.length,
    connected: channels.filter(c => c.isActive === 1).length,
    disconnected: channels.filter(c => c.isActive === 0).length
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-defi-text">通知渠道</h1>
          <p className="text-defi-text-muted">管理您的通知渠道配置</p>
        </div>

        {channels.length < 10 && hasAuth && (
          <Button onClick={() => setIsAddModalOpen(true)} variant="primary">
            添加渠道
          </Button>
        )}
      </motion.div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-defi-text-muted">总渠道数</p>
              <p className="font-mono text-2xl font-bold text-defi-text">
                {stats.total}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500/10">
              <Bell className="h-6 w-6 text-primary-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-defi-text-muted">已连接</p>
              <p className="font-mono text-2xl font-bold text-success-400">
                {stats.connected}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success-500/10">
              <CheckCircle className="h-6 w-6 text-success-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-defi-text-muted">未连接</p>
              <p className="font-mono text-2xl font-bold text-error-400">
                {stats.disconnected}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-error-500/10">
              <XCircle className="h-6 w-6 text-error-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {channels.length !== 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
          <div className="border-b border-neutral-800 px-6 py-4">
            <h2 className="text-lg font-semibold text-defi-text">渠道列表</h2>
          </div>

          {/* 表格标题行 - 优化宽度分配 */}
          <div className="border-b border-neutral-800 bg-neutral-800/30 px-6 py-3">
            <div className="grid grid-cols-12 items-center gap-4">
              <div className="col-span-3">
                <span className="text-sm font-medium text-defi-text-muted">
                  渠道名称
                </span>
              </div>
              <div className="col-span-3">
                <span className="text-sm font-medium text-defi-text-muted">
                  渠道类型
                </span>
              </div>
              <div className="col-span-4">
                <span className="text-sm font-medium text-defi-text-muted">
                  绑定状态
                </span>
              </div>
              <div className="col-span-2 text-right">
                <span className="text-sm font-medium text-defi-text-muted">
                  操作
                </span>
              </div>
            </div>
          </div>

          {/* 渠道列表项 - 优化宽度分配 */}
          <div className="divide-y divide-neutral-800">
            {channels.map((channel, index) => (
              <ChannelItem
                channel={channel}
                index={index}
                onEdit={value => handleEditChannelName(channel, value)}
                onSave={() => saveChannelName(channel)}
                onBind={() => openEditModal(channel)}
                onDelete={() => handleDeleteChannel(channel)}
              />
              // <motion.div
              //   key={channel.id}
              //   initial={{ opacity: 0, x: -20 }}
              //   animate={{ opacity: 1, x: 0 }}
              //   transition={{ delay: index * 0.05 + 0.2 }}
              //   className="p-6 transition-colors hover:bg-neutral-800/30">
              //   <div className="grid grid-cols-12 items-center gap-4">
              //     {/* 渠道名称 - 25% 宽度 */}
              //     <div className="col-span-3">
              //       <h3 className="font-medium text-defi-text">
              //         {channel.channelName}
              //       </h3>
              //     </div>

              //     {/* 渠道类型 - 25% 宽度 */}
              //     <div className="col-span-3">
              //       <div className="flex items-center space-x-2">
              //         <span className="text-sm text-defi-text">
              //           {getChannelTypeName(channel.channelType)}
              //         </span>
              //       </div>
              //     </div>

              //     {/* 绑定状态 - 33% 宽度 */}
              //     <div className="col-span-4">
              //       <div className="flex items-center space-x-2">
              //         {channel.isActive ? (
              //           <>
              //             <div className="h-2 w-2 rounded-full bg-primary-400"></div>
              //             <span className="text-sm text-defi-text">已绑定</span>
              //           </>
              //         ) : (
              //           <>
              //             <div className="h-2 w-2 rounded-full bg-error-400"></div>
              //             <span
              //               className="cursor-pointer text-sm text-error-400"
              //               onClick={() => handleEditChannel(channel)}>
              //               未绑定，去绑定
              //             </span>
              //           </>
              //         )}
              //       </div>
              //     </div>

              //     {/* 操作栏 - 17% 宽度 */}
              //     <div className="col-span-2 flex items-center justify-end space-x-2">
              //       {/* 编辑按钮 */}
              //       <motion.button
              //         whileHover={{ scale: 1.1 }}
              //         whileTap={{ scale: 0.9 }}
              //         onClick={() => handleEditChannel(channel)}
              //         className="rounded-lg p-2 text-defi-text-muted transition-colors hover:bg-primary-500/10 hover:text-primary-400"
              //         title="编辑">
              //         <Edit className="h-4 w-4" />
              //       </motion.button>

              //       {/* 删除按钮 */}
              //       <motion.button
              //         whileHover={{ scale: 1.1 }}
              //         whileTap={{ scale: 0.9 }}
              //         onClick={() => handleDeleteChannel(channel)}
              //         className="rounded-lg p-2 text-defi-text-muted transition-colors hover:bg-error-500/10 hover:text-error-400"
              //         title="删除">
              //         <Trash2 className="h-4 w-4" />
              //       </motion.button>
              //     </div>
              //   </div>
              // </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-neutral-800 bg-neutral-900/50 py-12 text-center backdrop-blur-sm">
          <Bell className="mx-auto mb-4 h-16 w-16 text-defi-text-muted" />
          <h3 className="mb-2 text-xl font-semibold text-defi-text">
            暂无通知渠道
          </h3>
          <p className="mb-6 text-defi-text-muted">
            添加您的第一个通知渠道开始接收消息
          </p>
          <div className="flex justify-center">
            <AuthButton
              hasAuth={hasAuth}
              onClick={() => setIsAddModalOpen(true)}
              variant="primary"
              className="min-w-[200px]">
              添加第一个渠道
            </AuthButton>
          </div>
        </motion.div>
      )}

      {/* 添加渠道弹窗 */}
      <AddChannelModal
        isOpen={isAddModalOpen}
        isEdit={editMode.status}
        channelData={editMode.data}
        onClose={handleModalClose}
        onAddTelegramChannel={onAddTelegramChannel}
      />

      <TelegramConfigModal
        isOpen={showTelegramModal}
        onClose={() => setShowTelegramModal(false)}
        channelName={tgChannelInfo.channelName}
        channelId={tgChannelInfo.channelId}
      />
    </div>
  )
}

export default Channel
