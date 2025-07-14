import { FC } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Trash2 } from 'lucide-react'
import Switch from '@/components/Switch'

export interface TwitterItem {
  id: string
  name: string
  username: string
  isActive: boolean
}
interface Props {
  list: TwitterItem[]
  handleChange: (id: string) => void
  handleDelete: (id: string) => void
}

const Twitter: FC<Props> = ({ list, handleChange, handleDelete }) => {
  return (
    <div className="space-y-4">
      {list.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-sm transition-colors hover:bg-neutral-800/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-accent-500 to-primary-500">
                <span className="text-sm font-bold text-black">T</span>
              </div>
              <div>
                <h3 className="font-medium text-defi-text">{item.name}</h3>
                <p className="font-mono text-sm text-defi-text-muted">
                  {item.username}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* 状态指示器 */}
              <div className="flex items-center space-x-2">
                {item.isActive ? (
                  <Eye className="h-4 w-4 text-accent-400" />
                ) : (
                  <EyeOff className="h-4 w-4 text-defi-text-muted" />
                )}
                <span
                  className={`text-xs ${
                    item.isActive ? 'text-accent-400' : 'text-defi-text-muted'
                  }`}>
                  {item.isActive ? '监控中' : '已暂停'}
                </span>
              </div>

              {/* 开关 */}
              <Switch
                checked={item.isActive}
                onChange={() => handleChange(item.id)}
              />

              {/* 删除按钮 */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleDelete(item.id)}
                className="rounded-lg p-2 text-defi-text-muted transition-colors hover:bg-error-500/10 hover:text-error-400">
                <Trash2 className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default Twitter
