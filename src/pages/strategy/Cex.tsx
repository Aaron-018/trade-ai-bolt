import { FC, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Settings } from 'lucide-react'
import Switch from '@/components/Switch'
import { AuthButton } from '@/components/Button'
import clsxm from '@/utils/clsxm'
import { useStrategyStore, useSysStore } from '@/store'
import useAuth from '@/hooks/useAuth'
import toast from '@/utils/toast'
import { ICexStrategy } from '@/service/api/types'

const enabledCex = ['Binance', 'Upbit']

const Cex: FC = () => {
  const [list, setList] = useState<ICexStrategy[]>([])
  const cexStrategies = useStrategyStore(state => state.cexStrategies)
  const addCexStrategy = useStrategyStore(state => state.addCexStrategy)
  const sysConfig = useSysStore(state => state.config)

  const hasAuth = useAuth()

  useEffect(() => {
    // console.log(cexStrategies, 2342424)
    if (!sysConfig?.articleSources.length) return
    const articles = [...sysConfig.articleSources]
    const _sysCexs = articles.sort((a, b) => {
      const aIsEnabled = enabledCex.includes(a)
      const bIsEnabled = enabledCex.includes(b)

      // 如果 a 在 enabledCex 而 b 不在，a 排在前面
      if (aIsEnabled && !bIsEnabled) return -1

      // 如果 b 在 enabledCex 而 a 不在，b 排在前面
      if (!aIsEnabled && bIsEnabled) return 1

      // 如果都在或都不在 enabledCex 保持原顺序
      return articles.indexOf(a) - articles.indexOf(b)
    })
    if (cexStrategies.length) {
      const _list = _sysCexs.map(v => {
        const item = cexStrategies.find(item => item.source === v)
        if (item) {
          return item
        }
        return {
          source: v,
          isActive: 0
        }
      }) as ICexStrategy[]
      setList(_list)
    } else {
      const _list = _sysCexs.map(v => ({
        source: v,
        isActive: 0
      })) as ICexStrategy[]
      setList(_list)
    }
  }, [sysConfig, cexStrategies])

  const handleChange = async (item: ICexStrategy) => {
    if (enabledCex.includes(item.source)) {
      try {
        const unsub = item.isActive === 1 ? true : false
        await addCexStrategy(item.source, unsub)
        toast.success(`${item.source} 监控${unsub ? '已关闭' : '已开启'}`)
      } catch (e) {
        toast.error(e)
      }
    }
  }

  return (
    <div className="space-y-4">
      {list.map((item, index) => (
        <motion.div
          key={item.source}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}>
          <div
            className={clsxm(
              'rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-sm transition-colors hover:bg-neutral-800/30',
              !enabledCex.includes(item.source) && 'opacity-70'
            )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-secondary-500 to-accent-500">
                  <Settings className="h-5 w-5 text-black" />
                </div>
                <div>
                  <h3 className="font-medium text-defi-text">{item.source}</h3>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {enabledCex.includes(item.source) ? (
                  hasAuth ? (
                    <>
                      {/* 状态指示器 */}
                      <div className="flex items-center space-x-2">
                        {item.isActive ? (
                          <Eye className="h-4 w-4 text-secondary-400" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-defi-text-muted" />
                        )}
                        <span
                          className={`text-xs ${
                            item.isActive
                              ? 'text-secondary-400'
                              : 'text-defi-text-muted'
                          }`}>
                          {item.isActive === 1 ? '监控中' : '已暂停'}
                        </span>
                      </div>

                      {/* 开关 */}
                      <Switch
                        disabled={!enabledCex.includes(item.source)}
                        checked={item.isActive === 1}
                        onChange={() => handleChange(item)}
                      />
                    </>
                  ) : (
                    <AuthButton>Login</AuthButton>
                  )
                ) : (
                  <span className="text-defi-text-muted'} text-xs">
                    暂不支持
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default Cex
