import { FC } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import Button from '@/components/Button'
import Pagination from '@/components/Pagination'
import Loading from '@/components/Loading'
import clsxm from '@/utils/clsxm'
import SortIcons, { SortDirection } from './SortIcon'
import { Spot } from '@/service/api/types'
import { formatOptions, toThousands, formatNumber } from '@/utils/utils'

export type TableProps<T> = {
  list: T[]
  sortField: string
  sortDirection: 'asc' | 'desc' | null
  currentPage: number
  pageTotal: number
  loading: boolean
  onSort: (field: string, direction: SortDirection) => void
  onChange: (page: number) => void
}

type SpotTableProps = TableProps<Spot>

// 获取状态颜色
const getStatusColor = (status: string) => {
  return status === 'Normal' ? 'text-success-400' : 'text-warning-400'
}

const SpotTable: FC<SpotTableProps> = ({
  list,
  sortField,
  sortDirection,
  currentPage,
  pageTotal,
  loading,
  onSort,
  onChange
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
      <Loading loading={loading}>
        {list.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-800/30">
                  <th className="px-4 py-3 text-left text-sm font-medium text-defi-text-muted">
                    Exchange
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-defi-text-muted">
                    Pair
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-defi-text-muted">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-defi-text-muted">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-defi-text-muted">
                    <div className="flex items-center space-x-1">
                      <span>Price</span>
                      <SortIcons
                        field="PRICE"
                        currentSortField={sortField}
                        currentSortDirection={sortDirection}
                        onSort={onSort}
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-defi-text-muted">
                    <div className="flex items-center space-x-1">
                      <span>+2% Depth</span>
                      <SortIcons
                        field="d2a"
                        currentSortField={sortField}
                        currentSortDirection={sortDirection}
                        onSort={onSort}
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-defi-text-muted">
                    <div className="flex items-center space-x-1">
                      <span>-2% Depth</span>
                      <SortIcons
                        field="d2b"
                        currentSortField={sortField}
                        currentSortDirection={sortDirection}
                        onSort={onSort}
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-defi-text-muted">
                    <div className="flex items-center space-x-1">
                      <span>+5% Depth</span>
                      <SortIcons
                        field="d5a"
                        currentSortField={sortField}
                        currentSortDirection={sortDirection}
                        onSort={onSort}
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-defi-text-muted">
                    <div className="flex items-center space-x-1">
                      <span>-5% Depth</span>
                      <SortIcons
                        field="d5b"
                        currentSortField={sortField}
                        currentSortDirection={sortDirection}
                        onSort={onSort}
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-defi-text-muted">
                    <div className="flex items-center space-x-1">
                      <span>Liquidity Score</span>
                      <SortIcons
                        field="ls"
                        currentSortField={sortField}
                        currentSortDirection={sortDirection}
                        onSort={onSort}
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-defi-text-muted">
                    <div className="flex items-center space-x-1">
                      <span>Total Supply</span>
                      <SortIcons
                        field="ts"
                        currentSortField={sortField}
                        currentSortDirection={sortDirection}
                        onSort={onSort}
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-defi-text-muted">
                    <div className="flex items-center space-x-1">
                      <span>Circulating Supply</span>
                      <SortIcons
                        field="cs"
                        currentSortField={sortField}
                        currentSortDirection={sortDirection}
                        onSort={onSort}
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-defi-text-muted">
                    <div className="flex items-center space-x-1">
                      <span>24h Volume (USDT)</span>
                      <SortIcons
                        field="v24"
                        currentSortField={sortField}
                        currentSortDirection={sortDirection}
                        onSort={onSort}
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-defi-text-muted">
                    <div className="flex items-center space-x-1">
                      <span>24h Volume (Token)</span>
                      <SortIcons
                        field="vt24"
                        currentSortField={sortField}
                        currentSortDirection={sortDirection}
                        onSort={onSort}
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-defi-text-muted">
                    <div className="flex items-center space-x-1">
                      <span>24h High</span>
                      <SortIcons
                        field="h24"
                        currentSortField={sortField}
                        currentSortDirection={sortDirection}
                        onSort={onSort}
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-defi-text-muted">
                    <div className="flex items-center space-x-1">
                      <span>24h Low</span>
                      <SortIcons
                        field="l24"
                        currentSortField={sortField}
                        currentSortDirection={sortDirection}
                        onSort={onSort}
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-defi-text-muted">
                    <div className="flex items-center space-x-1">
                      <span>Market Cap</span>
                      <SortIcons
                        field="MC"
                        currentSortField={sortField}
                        currentSortDirection={sortDirection}
                        onSort={onSort}
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-defi-text-muted">
                    <div className="flex items-center space-x-1">
                      <span>24h Change</span>
                      <SortIcons
                        field="HR24"
                        currentSortField={sortField}
                        currentSortDirection={sortDirection}
                        onSort={onSort}
                      />
                    </div>
                  </th>
                  <th className="sticky right-0 border-l border-neutral-700 bg-neutral-800/30 px-4 py-3 text-left text-sm font-medium text-defi-text-muted backdrop-blur-sm">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {list.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="transition-colors hover:bg-neutral-800/30">
                    <td className="px-4 py-4 text-sm text-defi-text">
                      {item.dataSource}
                    </td>
                    <td className="px-4 py-4">
                      <div className="whitespace-pre-line text-sm text-defi-text">
                        {item.baseAsset}/{item.quoteAsset}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={clsxm('text-sm')}>
                        {formatOptions(item.categories).join(' | ')}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={clsxm(
                          'text-sm font-medium',
                          getStatusColor(item.status)
                        )}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-mono text-sm">
                      {toThousands(item.currentPrice)}
                    </td>
                    <td className="px-4 py-4 font-mono text-sm">
                      {formatNumber(item.depth2Ask)}
                    </td>
                    <td className="px-4 py-4 font-mono text-sm">
                      {formatNumber(item.depth2Bid)}
                    </td>
                    <td className="px-4 py-4 font-mono text-sm">
                      {formatNumber(item.depth5Ask)}
                    </td>
                    <td className="px-4 py-4 font-mono text-sm">
                      {formatNumber(item.depth5Bid)}
                    </td>
                    <td className="px-4 py-4 font-mono text-sm">
                      {item.liquidityScore || '--'}
                    </td>
                    <td className="px-4 py-4 font-mono text-sm">
                      {toThousands(item.totalSupply)}
                    </td>
                    <td className="px-4 py-4 font-mono text-sm">
                      {toThousands(item.circulatingSupply)}
                    </td>
                    <td className="px-4 py-4 font-mono text-sm">
                      {formatNumber(item.volume24h)}
                    </td>
                    <td className="px-4 py-4 font-mono text-sm">
                      {formatNumber(item.volumeToken24h)}
                    </td>
                    <td className="px-4 py-4 font-mono text-sm">
                      {item.high24h}
                    </td>
                    <td className="px-4 py-4 font-mono text-sm">
                      {item.low24h}
                    </td>
                    <td className="px-4 py-4 font-mono text-sm">
                      {toThousands(formatNumber(item.marketCap))}
                    </td>
                    <td
                      className={clsxm(
                        'whitespace-nowrap px-4 py-4 font-mono text-sm',
                        item.priceChangePercent24h < 0
                          ? 'text-defi-down'
                          : 'text-defi-up'
                      )}>
                      {item.priceChangePercent24h}%
                    </td>
                    <td className="sticky right-0 border-l border-neutral-700 bg-neutral-900/50 px-4 py-4 backdrop-blur-sm">
                      <Link
                        to={`/cex-token/${item.symbol}?type=spot&dataSource=${item.dataSource}`}>
                        <Button variant="primary" size="sm">
                          Analysis
                        </Button>
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-800">
              <Activity className="h-8 w-8 text-defi-text-muted" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-defi-text">
              暂无现货数据
            </h3>
            <p className="text-center text-defi-text-muted">
              当前没有符合条件的现货交易数据
            </p>
          </div>
        )}
        <Pagination
          currentPage={currentPage}
          total={pageTotal}
          onPageChange={onChange}
        />
      </Loading>
    </motion.div>
  )
}

export default SpotTable
