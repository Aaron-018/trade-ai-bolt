import { FC } from 'react'
import { motion } from 'framer-motion'
import { Edit as EditIcon, Trash2 } from 'lucide-react'
import Edit from '@/components/Edit'
import { IChannel } from '@/service/api/types'

interface ChannelItemProps {
  index: number
  channel: IChannel
  onEdit: (value: string) => void
  onSave: () => Promise<boolean>
  onBind: () => void
  onDelete: () => Promise<void>
}
const ChannelItem: FC<ChannelItemProps> = ({
  index,
  channel,
  onEdit,
  onSave,
  onBind,
  onDelete
}) => {
  // 获取渠道类型显示名称
  const getChannelTypeName = (channel: IChannel) => {
    const type = channel.channelType
    if (type === 'TELEGRAM') {
      return 'Telegram'
    }
    if (type === 'WEBHOOK') {
      return '自定义API'
    }
    return ''
  }

  return (
    <motion.div
      key={channel.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 + 0.2 }}
      className="p-6 transition-colors hover:bg-neutral-800/30">
      <div className="grid grid-cols-12 items-center gap-4">
        {/* 渠道名称 - 25% 宽度 */}
        <div className="col-span-3">
          <Edit value={channel.channelName} onEdit={onEdit} onSave={onSave}>
            <div className="font-medium text-defi-text">
              {channel.channelName}
            </div>
          </Edit>
        </div>

        {/* 渠道类型 - 25% 宽度 */}
        <div className="col-span-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-defi-text">
              {getChannelTypeName(channel)}
            </span>
          </div>
        </div>

        {/* 绑定状态 - 33% 宽度 */}
        <div className="col-span-4">
          <div className="flex items-center space-x-2">
            {channel.isActive ? (
              <>
                <div className="h-2 w-2 rounded-full bg-primary-400"></div>
                <span className="text-sm text-defi-text">已绑定</span>
              </>
            ) : (
              <>
                <div className="h-2 w-2 rounded-full bg-error-400"></div>
                <span
                  className="cursor-pointer text-sm text-error-400"
                  onClick={onBind}>
                  未绑定，去绑定
                </span>
              </>
            )}
          </div>
        </div>

        {/* 操作栏 - 17% 宽度 */}
        <div className="col-span-2 flex items-center justify-end space-x-2">
          {/* 编辑按钮 */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBind}
            className="rounded-lg p-2 text-defi-text-muted transition-colors hover:bg-primary-500/10 hover:text-primary-400"
            title="Edit">
            <EditIcon className="h-4 w-4" />
          </motion.button>

          {/* 删除按钮 */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onDelete}
            className="rounded-lg p-2 text-defi-text-muted transition-colors hover:bg-error-500/10 hover:text-error-400"
            title="删除">
            <Trash2 className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default ChannelItem
