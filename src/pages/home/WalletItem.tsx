import { FC } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Trash2 } from 'lucide-react'
import Switch from '@/components/Switch'
import Copy from '@/components/Copy'
import Edit from '@/components/Edit'
import { superLong } from '@/utils/utils'
import { IWatchListItem } from '@/service/api/types'

interface WalletItemProps {
  index: number
  wallet: IWatchListItem
  onEdit: (value: string) => void
  onSave: () => Promise<boolean>
  onSwitch: () => Promise<void>
  onDelete: () => Promise<void>
}
const WalletItem: FC<WalletItemProps> = ({
  index,
  wallet,
  onEdit,
  onSave,
  onSwitch,
  onDelete
}) => {
  const getAddressOrAlias = (item: IWatchListItem) => {
    const { addressAlias, listeningAddress } = item
    if (addressAlias) return addressAlias
    if (!listeningAddress) return ''
    return listeningAddress.slice(-4).toUpperCase()
  }

  return (
    <motion.div
      key={wallet.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 + 0.1 }}
      className="p-6 transition-colors hover:bg-neutral-800/30">
      <div className="flex items-center justify-between">
        {/* 钱包信息 */}
        <div className="flex items-center space-x-4">
          <Edit value={wallet.addressAlias} onEdit={onEdit} onSave={onSave}>
            <div className="flex h-10 items-center justify-center rounded-lg border border-primary-500/30 bg-gradient-primary px-1.5 text-sm font-bold text-white">
              {getAddressOrAlias(wallet)}
            </div>
          </Edit>
          <div className="flex items-center space-x-2">
            <div
              className="font-mono font-medium text-defi-text"
              title={wallet.listeningAddress}>
              {superLong(wallet.listeningAddress, 6)}
            </div>

            <Copy text={wallet.listeningAddress} />
            {/* <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-defi-text-muted transition-colors hover:text-primary-400">
                        <ExternalLink className="h-4 w-4" />
                      </motion.button> */}
          </div>
        </div>

        {/* 操作栏 */}
        <div className="flex items-center space-x-4">
          {/* 观察开关 */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-defi-text-muted">观察</span>
            <Switch checked={wallet.isActive === 1} onChange={onSwitch} />
          </div>

          {/* 状态指示器 */}
          <div className="flex items-center space-x-1">
            {wallet.isActive === 1 ? (
              <Eye className="h-4 w-4 text-primary-400" />
            ) : (
              <EyeOff className="h-4 w-4 text-defi-text-muted" />
            )}
            <span
              className={`text-xs ${
                wallet.isActive === 1
                  ? 'text-primary-400'
                  : 'text-defi-text-muted'
              }`}>
              {wallet.isActive === 1 ? '观察中' : '已暂停'}
            </span>
          </div>

          {/* 删除按钮 */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onDelete}
            className="rounded-lg p-2 text-defi-text-muted transition-colors hover:bg-error-500/10 hover:text-error-400">
            <Trash2 className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default WalletItem
