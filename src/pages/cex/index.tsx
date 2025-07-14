import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Select from '@/components/Select'
import SpotTable from './SpotTable'
import FuturesTable from './FuturesTable'
import { SortDirection } from './SortIcon'
import clsxm from '@/utils/clsxm'
import {
  getSpotList as getSpotListApi,
  getFuturesList as getFuturesListApi
} from '@/service/api'
import { CexListQuery, Futures, Spot } from '@/service/api/types'

type TabType = 'spot' | 'futures'

interface PageInfo {
  page: number
  total: number
}

interface SortInfo {
  field: string
  direction: SortDirection
}

const Cex = () => {
  const [activeTab, setActiveTab] = useState<TabType>('spot')
  const [spotPageInfo, setSpotPageInfo] = useState<PageInfo>({
    page: 1,
    total: 0
  })
  const [spotLoading, setSpotLoading] = useState(false)
  const [spotSortInfo, setSpotSortInfo] = useState<SortInfo>({
    field: '',
    direction: null
  })
  const [spotList, setSpotList] = useState<Spot[]>([])

  const [futuresPageInfo, setFuturesPageInfo] = useState<PageInfo>({
    page: 1,
    total: 0
  })
  const [futuresLoading, setFuturesLoading] = useState(false)
  const [futuresSortInfo, setFuturesSortInfo] = useState<SortInfo>({
    field: '',
    direction: null
  })
  const [futuresList, setFuturesList] = useState<Futures[]>([])

  // 搜索过滤状态
  const [searchFilters, setSearchFilters] = useState({
    tokenName: '',
    exchange: '',
    status: ''
  })

  // Exchange选项
  const exchangeOptions = [
    { value: 'Binance', label: 'Binance' },
    { value: 'OKX', label: 'OKX' }
  ]

  // Status选项
  const statusOptions = [
    { value: 'TRADING', label: 'TRADING' },
    { value: 'TERMINATION', label: 'TERMINATION' }
  ]

  const getSpotList = async (data: CexListQuery | null) => {
    setSpotLoading(true)
    const { list, total } = await getSpotListApi(data)
    setSpotList(list)
    setSpotPageInfo(prev => ({ ...prev, total }))
    setSpotLoading(false)
  }
  const getFuturesList = async (data: CexListQuery | null) => {
    setFuturesLoading(true)
    const { list, total } = await getFuturesListApi(data)
    setFuturesList(list)
    setFuturesPageInfo(prev => ({ ...prev, total }))
    setFuturesLoading(false)
  }

  useEffect(() => {
    getSpotList(null)
    getFuturesList(null)
  }, [])

  // 处理搜索过滤
  const handleFilterChange = (field: string, value: string) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // 执行搜索过滤
  const handleFilter = () => {
    const { tokenName, exchange, status } = searchFilters
    if (activeTab === 'spot') {
      setSpotPageInfo(prev => ({
        ...prev,
        page: 1
      }))
      getSpotList({
        pageNum: 1,
        token: tokenName,
        dataSource: exchange,
        status,
        orderName: spotSortInfo.field,
        orderBy: spotSortInfo.direction || ''
      })
    } else {
      setFuturesPageInfo(prev => ({
        ...prev,
        page: 1
      }))
      getFuturesList({
        pageNum: 1,
        token: tokenName,
        dataSource: exchange,
        status,
        orderName: futuresSortInfo.field,
        orderBy: futuresSortInfo.direction || ''
      })
    }
  }

  // 重置过滤条件
  const handleResetFilters = () => {
    setSearchFilters({
      tokenName: '',
      exchange: '',
      status: ''
    })
    if (activeTab === 'spot') {
      setSpotPageInfo({
        page: 1,
        total: 0
      })
      setSpotSortInfo({
        field: '',
        direction: null
      })
      getSpotList(null)
    } else {
      setFuturesPageInfo({
        page: 1,
        total: 0
      })
      setFuturesSortInfo({
        field: '',
        direction: null
      })
      getFuturesList(null)
    }
  }

  // 处理分页变化
  const handlePageChange = (page: number) => {
    const { tokenName, exchange, status } = searchFilters
    if (activeTab === 'spot') {
      setSpotPageInfo(prev => ({
        ...prev,
        page
      }))

      getSpotList({
        pageNum: page,
        token: tokenName,
        dataSource: exchange,
        status,
        orderName: spotSortInfo.field,
        orderBy: spotSortInfo.direction || ''
      })
    } else {
      setFuturesPageInfo(prev => ({
        ...prev,
        page
      }))
      getFuturesList({
        pageNum: page,
        token: tokenName,
        dataSource: exchange,
        status,
        orderName: futuresSortInfo.field,
        orderBy: futuresSortInfo.direction || ''
      })
    }
  }

  // 处理排序
  const handleSort = (field: string, direction: SortDirection) => {
    // console.log(field, 234234)
    const { tokenName, exchange, status } = searchFilters
    const _field = direction ? field : ''
    if (activeTab === 'spot') {
      setSpotSortInfo({
        field: _field,
        direction
      })
      setSpotPageInfo(prev => ({
        ...prev,
        page: 1
      }))
      getSpotList({
        pageNum: 1,
        token: tokenName,
        dataSource: exchange,
        status,
        orderName: _field,
        orderBy: direction || ''
      })
    } else {
      setFuturesSortInfo({
        field: _field,
        direction
      })
      setFuturesPageInfo(prev => ({
        ...prev,
        page: 1
      }))
      getFuturesList({
        pageNum: 1,
        token: tokenName,
        dataSource: exchange,
        status,
        orderName: _field,
        orderBy: direction || ''
      })
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
          <h1 className="mb-2 text-3xl font-bold text-defi-text">CEX监控</h1>
          <p className="text-defi-text-muted">
            监控中心化交易所的现货和期货数据
          </p>
        </div>
      </motion.div>

      {/* 搜索过滤模块 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-sm">
        <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-4">
          {/* Token名称输入框 */}
          <Input
            value={searchFilters.tokenName}
            onChange={value => handleFilterChange('tokenName', value)}
            label="Token名称"
            placeholder="请输入Token名称"
            className="w-full"
          />

          {/* Exchange下拉框 */}
          <Select
            value={searchFilters.exchange}
            onChange={value => handleFilterChange('exchange', value)}
            options={exchangeOptions}
            placeholder="All"
            label="Exchange"
            clearable
            className="w-full"
          />

          {/* Status下拉框 */}
          <Select
            value={searchFilters.status}
            onChange={value => handleFilterChange('status', value)}
            options={statusOptions}
            placeholder="All"
            label="Status"
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
              className="px-3">
              重置
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Tab导航 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-2 backdrop-blur-sm">
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('spot')}
            className={clsxm(
              'relative rounded-lg px-6 py-3 text-sm font-medium transition-all',
              activeTab === 'spot'
                ? 'bg-primary-500 text-black'
                : 'text-defi-text-muted hover:bg-neutral-800/50 hover:text-defi-text'
            )}>
            Spot
            {activeTab === 'spot' && (
              <motion.div
                layoutId="cexActiveTab"
                className="absolute inset-0 -z-10 rounded-lg bg-primary-500"
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('futures')}
            className={clsxm(
              'relative rounded-lg px-6 py-3 text-sm font-medium transition-all',
              activeTab === 'futures'
                ? 'bg-primary-500 text-black'
                : 'text-defi-text-muted hover:bg-neutral-800/50 hover:text-defi-text'
            )}>
            Futures
            {activeTab === 'futures' && (
              <motion.div
                layoutId="cexActiveTab"
                className="absolute inset-0 -z-10 rounded-lg bg-primary-500"
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            )}
          </motion.button>
        </div>
      </motion.div>

      {activeTab === 'spot' ? (
        <SpotTable
          list={spotList}
          sortField={spotSortInfo.field}
          sortDirection={spotSortInfo.direction}
          currentPage={spotPageInfo.page}
          pageTotal={spotPageInfo.total}
          loading={spotLoading}
          onSort={handleSort}
          onChange={handlePageChange}
        />
      ) : (
        <FuturesTable
          list={futuresList}
          sortField={futuresSortInfo.field}
          sortDirection={futuresSortInfo.direction}
          currentPage={futuresPageInfo.page}
          pageTotal={futuresPageInfo.total}
          loading={futuresLoading}
          onSort={handleSort}
          onChange={handlePageChange}
        />
      )}
    </div>
  )
}

export default Cex
