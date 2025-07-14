import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, Search } from 'lucide-react'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Select from '@/components/Select'
import Pagination from '@/components/Pagination'
import Loading from '@/components/Loading'
import clsxm from '@/utils/clsxm'
import dayjs from 'dayjs'
import { getAlertList as getAlertListApi } from '@/service/api'
import { AlertListQuery, IAlert, RiskLevel } from '@/service/api/types'

const formatTime = (time: number) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm')
}

const Notifications = () => {
  const [alerts, setAlerts] = useState<IAlert[]>([])

  const [pageInfo, setPageInfo] = useState({
    page: 1,
    total: 0
  })
  const [isLoading, setIsLoading] = useState(false)

  const getAlertList = async (data: AlertListQuery | null) => {
    setIsLoading(true)
    const { list, total } = await getAlertListApi(data)
    setAlerts(list)
    setPageInfo(prev => ({ ...prev, total }))
    setIsLoading(false)
  }

  useEffect(() => {
    getAlertList(null)
  }, [])

  // 搜索过滤状态
  const [searchFilters, setSearchFilters] = useState<{
    keywords: string
    riskLevel: RiskLevel
  }>({
    keywords: '',
    riskLevel: ''
  })

  // Status选项
  const riskOptions = [
    { value: 'L', label: 'Low' },
    { value: 'M', label: 'Medium' },
    { value: 'H', label: 'High' },
    { value: 'U', label: 'Emergency' }
  ]

  // 处理搜索过滤
  const handleFilterChange = (field: string, value: string) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // 执行搜索过滤
  const handleFilter = () => {
    setPageInfo(prev => ({
      ...prev,
      page: 1
    }))
    getAlertList({
      pageNum: 1,
      keywords: searchFilters.keywords,
      riskLevel: searchFilters.riskLevel
    })
  }

  // 重置过滤条件
  const handleResetFilters = () => {
    setSearchFilters({
      keywords: '',
      riskLevel: ''
    })
    setPageInfo({
      page: 1,
      total: 0
    })
    getAlertList(null)
  }

  // 处理分页变化
  const handlePageChange = (page: number) => {
    setPageInfo(prev => ({ ...prev, page }))
    getAlertList({
      pageNum: page,
      keywords: searchFilters.keywords,
      riskLevel: searchFilters.riskLevel
    })
  }

  // 获取通知图标
  // 获取通知颜色
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'L':
        return {
          dot: 'bg-success-400',
          icon: 'text-success-400',
          badge: 'bg-success-400 text-black',
          border: 'border-success-400/30',
          bgClass: 'bg-success-500/10'
        }
      case 'M':
        return {
          dot: 'bg-warning-400',
          icon: 'text-warning-400',
          badge: 'bg-warning-400 text-black',
          border: 'border-warning-400/30',
          bgClass: 'bg-warning-500/10'
        }
      case 'H':
        return {
          dot: 'bg-orange-400',
          icon: 'text-orange-400',
          badge: 'bg-orange-400 text-black',
          border: 'border-orange-400/30',
          bgClass: 'bg-orange-500/10'
        }
      case 'U':
        return {
          dot: 'bg-red-500',
          icon: 'text-red-400',
          badge: 'bg-red-500 text-white',
          border: 'border-red-500/30',
          bgClass: 'bg-red-500/10'
        }
      default:
        return {
          dot: 'bg-defi-text-muted',
          icon: 'text-defi-text-muted',
          badge: 'bg-neutral-600 text-defi-text',
          border: 'border-neutral-600/30',
          bgClass: 'bg-neutral-500/10'
        }
    }
  }

  // 获取通知标签文本
  const getNotificationLabel = (type: string) => {
    switch (type) {
      case 'L':
        return 'Low Risk'
      case 'M':
        return 'Medium Risk'
      case 'H':
        return 'High Risk'
      case 'U':
        return 'Emergency'
      default:
        return 'Unknown'
    }
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-defi-text">通知消息</h1>
          <p className="text-defi-text-muted">查看系统监控和交易提醒消息</p>
        </div>
      </motion.div>

      {/* 搜索过滤模块 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-sm">
        <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-3">
          {/* 关键词输入框 */}
          <Input
            value={searchFilters.keywords}
            onChange={value => handleFilterChange('keywords', value)}
            label="关键词搜索"
            placeholder="搜索通知标题或内容"
            className="w-full"
          />

          {/* Status下拉框 */}
          <Select
            value={searchFilters.riskLevel}
            onChange={value => handleFilterChange('riskLevel', value)}
            options={riskOptions}
            placeholder="All"
            label="Risk Level"
            clearable
            className="w-full"
          />

          {/* 操作按钮 */}
          <div className="flex space-x-2">
            <Button
              onClick={handleFilter}
              variant="primary"
              className="flex flex-1 items-center justify-center space-x-2">
              <Search className="h-4 w-4" />
              <span>Filter</span>
            </Button>

            <Button
              onClick={handleResetFilters}
              variant="neutral"
              size="md"
              className="flex items-center justify-center space-x-2">
              <span>重置</span>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* 通知列表 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4">
        <Loading loading={isLoading}>
          {alerts.length > 0 ? (
            <div className="space-y-4">
              {alerts.map((alert, index) => {
                const colors = getNotificationColor(alert.riskLevel)

                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={clsxm(
                      'relative rounded-xl border bg-neutral-900/50 p-6 backdrop-blur-sm transition-all duration-300',
                      'hover:bg-neutral-800/30',
                      colors.border
                    )}>
                    {/* 时间戳 */}
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-defi-text-muted" />
                        <span className="font-mono text-sm text-defi-text-muted">
                          {formatTime(alert.createdDate)}
                        </span>
                      </div>
                      <span
                        className={clsxm(
                          'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                          colors.badge
                        )}>
                        {getNotificationLabel(alert.riskLevel)}
                      </span>
                    </div>

                    {/* 通知内容 */}
                    <div className="">
                      <p className="leading-relaxed text-defi-text-muted">
                        {alert.alertContent}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-800">
                <CheckCircle className="h-8 w-8 text-defi-text-muted" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-defi-text">
                暂无通知消息
              </h3>
              <p className="text-center text-defi-text-muted">
                当前没有符合条件的通知消息
              </p>
            </div>
          )}
          <Pagination
            currentPage={pageInfo.page}
            total={pageInfo.total}
            onPageChange={handlePageChange}
          />
        </Loading>
      </motion.div>
    </div>
  )
}

export default Notifications
