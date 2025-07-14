import { FC, useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Trash2, Edit } from 'lucide-react'
import Switch from '@/components/Switch'
import EditWalletMonitor from './EditWalletMonitor'
import { useStrategyStore } from '@/store'
import toast from '@/utils/toast'
import { IWalletStrategy } from '@/service/api/types'

const Wallet: FC = () => {
  const walletStrategies = useStrategyStore(state => state.walletStrategies)
  const updateWalletStrategy = useStrategyStore(
    state => state.updateWalletStrategy
  )
  const deleteWalletStrategy = useStrategyStore(
    state => state.deleteWalletStrategy
  )

  const [showEdit, setShowEdit] = useState(false)
  const [editData, setEditData] = useState<IWalletStrategy>(
    {} as IWalletStrategy
  )

  const activeStrategy = async (strategy: IWalletStrategy) => {
    try {
      const inactive = strategy.isActive === 1 ? true : false
      await updateWalletStrategy({
        strategyId: strategy.id,
        inactive
      })
      toast.success(
        `${strategy.monitorName} 监控${inactive ? '已关闭' : '已开启'}`
      )
    } catch (e) {
      toast.error(e)
    }
  }

  const handleEdit = (strategy: IWalletStrategy) => {
    setShowEdit(true)
    setEditData(strategy)
  }

  const handleDelete = async (strategy: IWalletStrategy) => {
    try {
      await deleteWalletStrategy(strategy.id)
      toast.success(`已删除 ${strategy.monitorName}`)
    } catch (e) {
      toast.error(e)
    }
  }

  if (!walletStrategies.length) return null
  return (
    <div className="space-y-4">
      {walletStrategies.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-sm transition-colors hover:bg-neutral-800/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
                <Eye className="h-5 w-5 text-black" />
              </div>
              <div>
                <h3 className="font-medium text-defi-text">
                  {item.monitorName}
                </h3>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* 状态指示器 */}
              <div className="flex items-center space-x-2">
                {item.isActive ? (
                  <Eye className="h-4 w-4 text-primary-400" />
                ) : (
                  <EyeOff className="h-4 w-4 text-defi-text-muted" />
                )}
                <span
                  className={`text-xs ${
                    item.isActive ? 'text-primary-400' : 'text-defi-text-muted'
                  }`}>
                  {item.isActive ? '监控中' : '已暂停'}
                </span>
              </div>

              {/* 开关 */}
              <Switch
                checked={item.isActive === 1}
                onChange={() => activeStrategy(item)}
              />
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleEdit(item)}
                  className="rounded-lg p-2 text-defi-text-muted transition-colors hover:bg-primary-500/10 hover:text-primary-400"
                  title="编辑">
                  <Edit className="h-4 w-4" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDelete(item)}
                  className="rounded-lg p-2 text-defi-text-muted transition-colors hover:bg-primary-500/10 hover:text-primary-400">
                  <Trash2 className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
      <EditWalletMonitor
        isOpen={showEdit}
        data={editData}
        onClose={() => setShowEdit(false)}
      />
    </div>
  )
}

export default Wallet
