import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { motion, HTMLMotionProps } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import dayjs from 'dayjs'
import Button from '@/components/Button'
import Loading from '@/components/Loading'
import { DepthLiquidity, TradingVolume } from './Chart'
import type { DepthData, TradingData } from './Chart'
import clsxm from '@/utils/clsxm'
import { formatNumber } from '@/utils/utils'
import { getSpotHistory, getFuturesHistory } from '@/service/api'
import { FuturesHistory, SpotHistory } from '@/service/api/types'

interface VolumeData {
  timestamp: string
  time: string
  volume: number
  price: number
}

type ContainerProps = HTMLMotionProps<'div'> & {
  children: React.ReactNode
  className?: string
}

const Container = ({ children, className, ...rest }: ContainerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
      {...rest}>
      {children}
    </motion.div>
  )
}

const Title = ({ title }: { title: string }) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <h3 className="text-lg font-semibold text-defi-text">{title}</h3>
      </div>
    </div>
  )
}

/* type TimeInterval = '8H' | '16H' | '24H'
interface RawData {
  createdDate: string | Date
  time: string
  [key: string]: any
}
function processChartData(
  interval: TimeInterval,
  rawData: RawData[]
): ChartData[] {
  if (!interval || !rawData.length) return []

  // 定义时间间隔（毫秒）
  const intervalMs: Record<TimeInterval, number> = {
    '8H': 8 * 60 * 60 * 1000, // 8小时
    '16H': 16 * 60 * 60 * 1000, // 16小时
    '24H': 24 * 60 * 60 * 1000 // 24小时
  }

  const msInterval = intervalMs[interval]

  const startTime = new Date(rawData[0].createdDate).getTime()
  const endTime = new Date(rawData[rawData.length - 1].createdDate).getTime()

  // 分组数据
  const groupedData: { [key: number]: RawData[] } = {}
  rawData.forEach(item => {
    const timestamp = new Date(item.createdDate).getTime()
    // 计算所属的时间段（向下取整到最近的 intervalMs）
    const groupKey =
      Math.floor((timestamp - startTime) / msInterval) * msInterval + startTime
    if (!groupedData[groupKey]) {
      groupedData[groupKey] = []
    }
    groupedData[groupKey].push(item)
  })

  // 转换为图表数据格式
  const chartData: ChartData[] = Object.keys(groupedData)
    .map(Number)
    .sort((a, b) => a - b)
    .map(groupTime => {
      const group = groupedData[groupTime]
      // 计算平均风险值（可根据需求改为取最新值或其他聚合逻辑）
      const avgRisk =
        group.reduce((sum, item) => sum + item.riskLevel, 0) / group.length

      return {
        time:
          new Date(groupTime).toISOString().split('T')[0] +
          ' ' +
          new Date(groupTime).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          }),
        value: Number(avgRisk.toFixed(2)) // 保留两位小数
      }
    })

  return chartData
} */

interface ChartData {
  depth: DepthData[]
  trading: TradingData[]
  basis: TradingData[]
  fundingRate: TradingData[]
  openInterest: TradingData[]
}

const CexToken = () => {
  const { symbol } = useParams<{ symbol: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const type = searchParams.get('type') || 'spot'
  const dataSource = searchParams.get('dataSource') || 'Binance'

  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<ChartData>({} as ChartData)
  const [timeRange, setTimeRange] = useState('8H')

  // 时间范围选项
  const timeRangeOptions = ['8H', '16H', '24H']

  // 模拟Depth数据
  const [depthData, setDepthData] = useState<DepthData[]>([])

  // 模拟Volume数据
  const [volumeData, setVolumeData] = useState<VolumeData[]>([])

  // 生成模拟数据
  useEffect(() => {
    if (!symbol || !type || !dataSource) return
    const getData = async () => {
      setIsLoading(true)
      if (type === 'spot') {
        return await getSpotHistory(symbol, dataSource)
      } else if (type === 'futures') {
        return await getFuturesHistory(symbol, dataSource)
      } else {
        return []
      }
    }
    getData().then(res => {
      if (type === 'spot') {
        const list = res as SpotHistory[]
        const depth: DepthData[] = []
        const trading: TradingData[] = []
        list.map(v => {
          depth.push({
            createDate: v.createdDate,
            time: dayjs(v.createdDate).format('YYYY-MM-DD HH:00'),
            depth2Ask: v.depth2Ask,
            depth2Bid: v.depth2Bid,
            depth5Ask: v.depth5Ask,
            depth5Bid: v.depth5Bid
          })
          trading.push({
            createDate: v.createdDate,
            time: dayjs(v.createdDate).format('YYYY-MM-DD HH:00'),
            value: v.volume24h
          })
        })
        setData(prev => ({ ...prev, depth, trading }))
      } else {
        const list = res as FuturesHistory[]
        const basis: TradingData[] = []
        const fundingRate: TradingData[] = []
        const openInterest: TradingData[] = []
        const trading: TradingData[] = []
        list.map(v => {
          basis.push({
            createDate: v.createdDate,
            time: dayjs(v.createdDate).format('YYYY-MM-DD HH:00'),
            value: v.basis || 0
          })
          fundingRate.push({
            createDate: v.createdDate,
            time: dayjs(v.createdDate).format('YYYY-MM-DD HH:00'),
            value: v.lastFundingRate || 0
          })
          openInterest.push({
            createDate: v.createdDate,
            time: dayjs(v.createdDate).format('YYYY-MM-DD HH:00'),
            value: v.openInterestUsdt || 0
          })
          trading.push({
            createDate: v.createdDate,
            time: dayjs(v.createdDate).format('YYYY-MM-DD HH:00'),
            value: v.volume24h
          })
        })
        setData(prev => ({
          ...prev,
          basis,
          fundingRate,
          openInterest,
          trading
        }))
      }
      setIsLoading(false)
    })

    // 模拟API调用
    // setTimeout(() => {
    //   // 根据时间范围生成不同数量的数据点
    //   const getDataPoints = () => {
    //     switch (timeRange) {
    //       case '8H':
    //         return 8
    //       case '16H':
    //         return 16
    //       case '24H':
    //         return 24
    //       default:
    //         return 24
    //     }
    //   }

    //   const dataPoints = getDataPoints()

    //   // 生成Depth数据
    //   const mockDepthData: DepthData[] = []
    //   const now = Date.now()
    //   for (let i = dataPoints - 1; i >= 0; i--) {
    //     const timestamp = new Date(now - i * 60 * 60 * 1000)
    //     mockDepthData.push({
    //       timestamp: timestamp.toISOString(),
    //       time: timestamp.toLocaleTimeString('zh-CN', {
    //         hour: '2-digit',
    //         minute: '2-digit'
    //       }),
    //       depth2Ask: 20000000 + Math.random() * 10000000,
    //       depth2Bid: 19000000 + Math.random() * 10000000,
    //       depth5Ask: 35000000 + Math.random() * 15000000,
    //       depth5Bid: 33000000 + Math.random() * 15000000
    //     })
    //   }
    //   setDepthData(mockDepthData)

    //   // 生成Volume数据
    //   const mockVolumeData: VolumeData[] = []
    //   for (let i = dataPoints - 1; i >= 0; i--) {
    //     const timestamp = new Date(now - i * 60 * 60 * 1000)
    //     mockVolumeData.push({
    //       timestamp: timestamp.toISOString(),
    //       time: timestamp.toLocaleTimeString('zh-CN', {
    //         hour: '2-digit',
    //         minute: '2-digit'
    //       }),
    //       volume: 1000000 + Math.random() * 5000000,
    //       price: 68000 + Math.random() * 2000
    //     })
    //   }
    //   setVolumeData(mockVolumeData)

    //   setIsLoading(false)
    // }, 1000)
  }, [timeRange, symbol, type, dataSource])

  // 返回上一页
  const handleGoBack = () => {
    navigate('/cex')
  }

  return (
    <div className="mx-auto w-[1000px] space-y-6 pt-3">
      {/* 页面头部 */}
      <Container className="flex items-center">
        <div className="flex items-center space-x-4">
          <Button
            onClick={handleGoBack}
            variant="neutral"
            size="sm"
            className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold text-defi-text">{symbol}</h1>
              <span className="rounded-full bg-neutral-700 px-2 py-1 text-xs font-medium text-defi-text">
                {dataSource}
              </span>
              <span
                className={clsxm(
                  'rounded-full px-2 py-1 text-xs font-medium',
                  type === 'spot'
                    ? 'border border-primary-500/30 bg-primary-500/10 text-primary-400'
                    : 'border border-secondary-500/30 bg-secondary-500/10 text-secondary-400'
                )}>
                {type === 'spot' ? '现货' : '期货'}
              </span>
            </div>
          </div>
        </div>
      </Container>

      {/* 时间范围选择 */}
      {/* <Container className="flex items-center">
        <div className="flex items-center space-x-2">
          {timeRangeOptions.map(range => (
            <motion.button
              key={range}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTimeRange(range)}
              className={clsxm(
                'rounded-lg px-3 py-2 text-sm font-medium transition-all',
                timeRange === range
                  ? 'bg-primary-500 text-black'
                  : 'bg-neutral-800 text-defi-text-muted hover:bg-neutral-700 hover:text-defi-text'
              )}>
              {range}
            </motion.button>
          ))}
        </div>
      </Container> */}

      {type === 'spot' && (
        <>
          {/* Depth Liquidity */}
          <Container
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-sm">
            <Title title="Depth Liquidity" />

            <DepthLiquidity isLoading={isLoading} data={data.depth} />
          </Container>

          {/* Trading Volume (USDT) */}
          <Container
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-sm">
            <Title title="Trading Volume (USDT)" />

            <TradingVolume isLoading={isLoading} data={data.trading} />
          </Container>
        </>
      )}

      {type === 'futures' && (
        <>
          {/* Basis */}
          <Container
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-sm">
            <Title title="Basis" />

            <TradingVolume isLoading={isLoading} data={data.basis} />
          </Container>

          {/* Funding Rate */}
          <Container
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-sm">
            <Title title="Funding Rate" />

            <TradingVolume isLoading={isLoading} data={data.fundingRate} />
          </Container>

          {/* Open Interest */}
          <Container
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-sm">
            <Title title="Open Interest" />

            <TradingVolume isLoading={isLoading} data={data.openInterest} />
          </Container>

          {/* Trading Volume (USDT) */}
          <Container
            transition={{ delay: 0.4 }}
            className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-sm">
            <Title title="Trading Volume (USDT)" />

            <TradingVolume isLoading={isLoading} data={data.trading} />
          </Container>
        </>
      )}
    </div>
  )
}

export default CexToken
