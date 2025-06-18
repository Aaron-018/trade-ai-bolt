import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Edit, Trash2, Plus, CheckCircle, XCircle } from 'lucide-react'
import Button from '@/components/Button'
import toast from '@/utils/toast'

// 定义渠道类型
interface NotificationChannel {
  id: string
  name: string
  type: 'telegram' | 'api'
  status: 'connected' | 'disconnected'
  config: {
    botToken?: string
    chatId?: string
    apiUrl?: string
  }
  createdAt: string
}

const Channel = () => {
  // 模拟数据
  const [channels, setChannels] = useState<NotificationChannel[]>([
    {
      id: '1',
      name: 'abc',
      type: 'api',
      status: 'disconnected',
      config: {
        apiUrl: 'https://api.dingding.com/webhook'
      },
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'sdk',
      type: 'telegram',
      status: 'disconnected',
      config: {
        botToken: '123456789:ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        chatId: '-1001234567890'
      },
      createdAt: '2024-01-10'
    },
    {
      id: '3',
      name: 'tg-a',
      type: 'telegram',
      status: 'disconnected',
      config: {
        botToken: '987654321:ZYXWVUTSRQPONMLKJIHGFEDCBA',
        chatId: '-1009876543210'
      },
      createdAt: '2024-01-08'
    }
  ])

  // 获取渠道类型显示名称
  const getChannelTypeName = (type: string) => {
    const typeMap = {
      telegram: 'telegram',
      api: 'dingding'
    }
    return typeMap[type as keyof typeof typeMap] || type
  }

  // 编辑渠道
  const handleEditChannel = (id: string) => {
    const channel = channels.find(c => c.id === id)
    if (channel) {
      toast.info(`编辑 ${channel.name}`)
      // 这里可以打开编辑弹窗
    }
  }

  // 删除渠道
  const handleDeleteChannel = (id: string) => {
    const channel = channels.find(c => c.id === id)
    if (channel) {
      setChannels(prev => prev.filter(c => c.id !== id))
      toast.success(`已删除 ${channel.name}`)
    }
  }

  // 添加渠道
  const handleAddChannel = () => {
    toast.info('添加新的通知渠道')
    // 这里可以打开添加渠道弹窗
  }

  // 统计数据
  const stats = {
    total: channels.length,
    connected: channels.filter(c => c.status === 'connected').length,
    disconnected: channels.filter(c => c.status === 'disconnected').length
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

        <Button onClick={handleAddChannel} variant="primary">
          添加渠道
        </Button>
      </motion.div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
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
          transition={{ delay: 0.2 }}
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
          transition={{ delay: 0.3 }}
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

      {/* 渠道列表 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
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
            <motion.div
              key={channel.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.5 }}
              className="p-6 transition-colors hover:bg-neutral-800/30">
              <div className="grid grid-cols-12 items-center gap-4">
                {/* 渠道名称 - 25% 宽度 */}
                <div className="col-span-3">
                  <h3 className="font-medium text-defi-text">{channel.name}</h3>
                </div>

                {/* 渠道类型 - 25% 宽度 */}
                <div className="col-span-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-defi-text">
                      {getChannelTypeName(channel.type)}
                    </span>
                  </div>
                </div>

                {/* 绑定状态 - 33% 宽度 */}
                <div className="col-span-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-error-400"></div>
                    <span className="text-sm text-error-400">
                      未绑定，去绑定
                    </span>
                  </div>
                </div>

                {/* 操作栏 - 17% 宽度 */}
                <div className="col-span-2 flex items-center justify-end space-x-2">
                  {/* 编辑按钮 */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEditChannel(channel.id)}
                    className="rounded-lg p-2 text-defi-text-muted transition-colors hover:bg-primary-500/10 hover:text-primary-400"
                    title="编辑">
                    <Edit className="h-4 w-4" />
                  </motion.button>

                  {/* 删除按钮 */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteChannel(channel.id)}
                    className="rounded-lg p-2 text-defi-text-muted transition-colors hover:bg-error-500/10 hover:text-error-400"
                    title="删除">
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 空状态提示 */}
      {channels.length === 0 && (
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
          <Button onClick={handleAddChannel} variant="primary">
            添加第一个渠道
          </Button>
        </motion.div>
      )}
    </div>
  )
}

export default Channel
