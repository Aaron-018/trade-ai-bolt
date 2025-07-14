import { FC, ReactElement } from 'react'
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
import Loading from '@/components/Loading'
import { formatNumber } from '@/utils/utils'
import dayjs from 'dayjs'

interface CharWrapProps {
  isLoading: boolean
  children: ReactElement
}
const ChartWrap: FC<CharWrapProps> = ({ isLoading, children }) => {
  return (
    <Loading loading={isLoading}>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </Loading>
  )
}

export interface DepthData {
  createDate: number
  time: string
  depth2Ask: number
  depth2Bid: number
  depth5Ask: number
  depth5Bid: number
}
interface DepthLiquidityProps {
  isLoading: boolean
  data: DepthData[]
}
export const DepthLiquidity: FC<DepthLiquidityProps> = ({
  isLoading,
  data
}) => {
  // 自定义Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-neutral-700 bg-neutral-900 p-3 shadow-lg">
          <p className="mb-2 text-sm text-defi-text">{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${formatNumber(entry.value)}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }
  return (
    <ChartWrap isLoading={isLoading}>
      <LineChart data={data}>
        {/* <CartesianGrid strokeDasharray="3 3" stroke="#404040" /> */}
        <XAxis
          dataKey="time"
          stroke="#a3a3a3"
          fontSize={12}
          tickFormatter={(value: string) => dayjs(value).format('HH:mm')}
        />
        <YAxis stroke="#a3a3a3" fontSize={12} tickFormatter={formatNumber} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="depth2Ask"
          stroke="#34d399"
          strokeWidth={2}
          dot={false}
          name="Depth 2% Ask"
        />
        <Line
          type="monotone"
          dataKey="depth2Bid"
          stroke="#14b8a6"
          strokeWidth={2}
          dot={false}
          name="Depth 2% Bid"
        />
        <Line
          type="monotone"
          dataKey="depth5Ask"
          stroke="#22c55e"
          strokeWidth={2}
          dot={false}
          name="Depth 5% Ask"
        />
        <Line
          type="monotone"
          dataKey="depth5Bid"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={false}
          name="Depth 5% Bid"
        />
      </LineChart>
    </ChartWrap>
  )
}

export interface TradingData {
  createDate: number
  time: string
  value: number
}
interface TradingVolumeProps {
  isLoading: boolean
  data: TradingData[]
}
export const TradingVolume: FC<TradingVolumeProps> = ({ isLoading, data }) => {
  const VolumeTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-neutral-700 bg-neutral-900 p-3 shadow-lg">
          <p className="mb-2 text-sm text-defi-text">{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              Value: {formatNumber(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }
  return (
    <ChartWrap isLoading={isLoading}>
      <LineChart data={data}>
        {/* <CartesianGrid strokeDasharray="3 3" stroke="#404040" /> */}
        <XAxis
          dataKey="time"
          stroke="#a3a3a3"
          fontSize={12}
          tickFormatter={(value: string) => dayjs(value).format('HH:mm')}
        />
        <YAxis stroke="#a3a3a3" fontSize={12} tickFormatter={formatNumber} />
        <Tooltip content={<VolumeTooltip />} />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#34d399"
          strokeWidth={2}
          dot={false}
          name="Value"
        />
      </LineChart>
    </ChartWrap>
  )
}
