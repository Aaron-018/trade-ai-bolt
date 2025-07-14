import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Eye } from 'lucide-react'
import AddWalletDrawer from '@/components/AddWalletDrawer'
import Button, { AuthButton } from '@/components/Button'
import WalletItem from './WalletItem'
import { useWatchListStore } from '@/store'
import useAuth from '@/hooks/useAuth'
import toast from '@/utils/toast'
import { superLong } from '@/utils/utils'
import { ISmartAddress, IWatchListItem } from '@/service/api/types'

const Home = () => {
  const hasAuth = useAuth()
  const list = useWatchListStore(state => state.list)
  const setList = useWatchListStore(state => state.setList)
  const getList = useWatchListStore(state => state.getList)
  const addItems = useWatchListStore(state => state.addItems)
  const toggleItem = useWatchListStore(state => state.toggleItem)
  const deleteItem = useWatchListStore(state => state.deleteItem)

  const [addLoading, setAddLoading] = useState(false)

  useEffect(() => {
    if (hasAuth) {
      getList()
    } else {
      setList([])
    }
  }, [getList, hasAuth, setList])

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleEdit = (item: IWatchListItem, alias: string) => {
    const newItems = list.map(v => {
      if (v.id === item.id) {
        return { ...item, addressAlias: alias }
      } else {
        return v
      }
    })
    // console.log(newItems, 22323)
    setList(newItems)
  }

  const saveEdit = async (item: IWatchListItem) => {
    try {
      const { listeningAddress, source, addressAlias, isActive } = item
      const account: ISmartAddress = {
        addr: listeningAddress,
        source: source,
        alias: addressAlias
      }
      const isUnsub = isActive === 0
      await addItems([account], isUnsub)
      toast.success('Success')
      return true
    } catch (e) {
      toast.error(e)
    }
    return false
  }

  // 切换观察状态
  const toggleWatching = async (item: IWatchListItem) => {
    try {
      await toggleItem(item)
      toast.success(
        item.isActive === 1
          ? `已停止观察 ${superLong(item.listeningAddress)}`
          : `已开始观察 ${superLong(item.listeningAddress)}`
      )
      getList()
    } catch (e) {
      toast.error(e)
    }
  }

  // 删除钱包
  const deleteWallet = async (item: IWatchListItem) => {
    try {
      await deleteItem(item)
      toast.success(`已删除钱包 ${superLong(item.listeningAddress)}`)
      getList()
    } catch (e) {
      toast.error(e)
    }
  }

  // 添加钱包（支持批量）
  const handleAddWallet = async (accounts: ISmartAddress[]) => {
    setAddLoading(true)
    // const newWallets: ISmartAddress[] = []

    // accounts.forEach(account => {
    //   // 检查是否已存在
    //   const exists = list.some(
    //     w => w.listeningAddress.toLowerCase() === account.addr.toLowerCase()
    //   )
    //   if (!exists) {
    //     newWallets.push(account)
    //   }
    // })

    try {
      await addItems(accounts)
      getList()
      toast.success('Success')
      closeAddWallet()
    } catch (e) {
      toast.error(e)
      setAddLoading(true)
    }
  }

  const closeAddWallet = () => {
    setAddLoading(false)
    setIsDrawerOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和统计 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-defi-text">观察钱包</h1>
          <p className="text-defi-text-muted">监控和管理您关注的钱包地址</p>
        </div>

        {hasAuth && (
          <Button onClick={() => setIsDrawerOpen(true)} variant="primary">
            添加钱包
          </Button>
        )}
      </motion.div>

      {/* 统计卡片 */}
      {/* <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-defi-text-muted">总钱包数</p>
              <p className="font-mono text-2xl font-bold text-defi-text">
                {stats.total}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500/10">
              <Eye className="h-6 w-6 text-primary-400" />
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
              <p className="text-sm text-defi-text-muted">正在观察</p>
              <p className="font-mono text-2xl font-bold text-primary-400">
                {stats.watching}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary-500/10">
              <Eye className="h-6 w-6 text-secondary-400" />
            </div>
          </div>
        </motion.div>
      </div> */}

      {/* 钱包列表 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
        <div className="border-b border-neutral-800 px-6 py-4">
          <h2 className="text-lg font-semibold text-defi-text">钱包列表</h2>
        </div>

        <div className="divide-y divide-neutral-800">
          {list.map((wallet, index) => (
            <WalletItem
              index={index}
              wallet={wallet}
              onEdit={value => handleEdit(wallet, value)}
              onSave={() => saveEdit(wallet)}
              onSwitch={() => toggleWatching(wallet)}
              onDelete={() => deleteWallet(wallet)}
            />
          ))}
        </div>
      </motion.div>

      {/* 空状态提示 */}
      {list.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-neutral-800 bg-neutral-900/50 py-12 text-center backdrop-blur-sm">
          <Eye className="mx-auto mb-4 h-16 w-16 text-defi-text-muted" />
          <h3 className="mb-2 text-xl font-semibold text-defi-text">
            暂无观察钱包
          </h3>
          <p className="mb-6 text-defi-text-muted">
            添加您想要监控的钱包地址开始使用
          </p>
          <div className="flex justify-center">
            <AuthButton
              hasAuth={hasAuth}
              onClick={() => setIsDrawerOpen(true)}
              variant="primary"
              className="min-w-[200px]">
              添加第一个钱包
            </AuthButton>
          </div>
        </motion.div>
      )}

      {/* 添加钱包抽屉 */}
      <AddWalletDrawer
        isOpen={isDrawerOpen}
        loading={addLoading}
        onClose={closeAddWallet}
        onAddWallet={handleAddWallet}
      />
    </div>
  )
}

export default Home
