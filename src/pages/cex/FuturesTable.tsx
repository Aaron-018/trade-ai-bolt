import { FC } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import Button from '@/components/Button'
import Pagination from '@/components/Pagination'
import Loading from '@/components/Loading'
import clsxm from '@/utils/clsxm'
import SortIcons from './SortIcon'
import { TableProps } from './SpotTable'
import { Futures } from '@/service/api/types'
import { formatOptions, toThousands, formatNumber } from '@/utils/utils'

type FuturesTableProps = TableProps<Futures>

const FuturesTable: FC<FuturesTableProps> = ({
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
      transition={{ delay: 0.3 }}
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
                    <div className="flex items-center space-x-1">
                      <span>Index Price</span>
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
                      <span>Basis</span>
                      <SortIcons
                        field="basis"
                        currentSortField={sortField}
                        currentSortDirection={sortDirection}
                        onSort={onSort}
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-defi-text-muted">
                    <div className="flex items-center space-x-1">
                      <span>Funding Rate</span>
                      <SortIcons
                        field="lfr"
                        currentSortField={sortField}
                        currentSortDirection={sortDirection}
                        onSort={onSort}
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-defi-text-muted">
                    Funding Interval
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-defi-text-muted">
                    <div className="flex items-center space-x-1">
                      <span>Open Interest (USDT)</span>
                      <SortIcons
                        field="oiu"
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
                    <td className="px-4 py-4 text-sm">{item.dataSource}</td>
                    <td className="px-4 py-4">
                      <div className="whitespace-pre-line text-sm">
                        {item.baseAsset}/{item.quoteAsset}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={clsxm('text-sm')}>
                        {formatOptions(item.categories || '').join(' | ')}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-mono text-sm">
                      {toThousands(item.indexPrice)}
                    </td>
                    <td className="px-4 py-4 font-mono text-sm">
                      {formatNumber(item.volume24h)}
                    </td>
                    <td className="px-4 py-4 font-mono text-sm">
                      {toThousands(item.high24h)}
                    </td>
                    <td className="px-4 py-4 font-mono text-sm">
                      {toThousands(item.low24h)}
                    </td>
                    <td className="px-4 py-4 font-mono text-sm">
                      {toThousands(item.basis) || '--'}
                    </td>
                    <td className="px-4 py-4 font-mono text-sm">
                      {item.lastFundingRate}
                    </td>
                    <td className="px-4 py-4 font-mono text-sm">
                      {item.fundingIntervalHours}
                    </td>
                    <td className="px-4 py-4 font-mono text-sm">
                      {formatNumber(item.openInterestUsdt)}
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
                        to={`/cex-token/${item.symbol}?type=futures&dataSource=${item.dataSource}`}>
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
              暂无期货数据
            </h3>
            <p className="text-center text-defi-text-muted">
              当前没有符合条件的期货交易数据
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

export default FuturesTable
