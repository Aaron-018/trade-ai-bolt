import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { SolanaAdapter } from '@reown/appkit-adapter-solana'
import { mainnet, bsc, base, solana } from '@reown/appkit/networks'
import type { AppKitNetwork } from '@reown/appkit/networks'

// 1. 获取项目ID - 需要在 https://cloud.reown.com 注册
const projectId = 'b56e18d47c72ab683b10814fe9495694' // 请替换为您的实际项目ID

// 2. 定义支持的链
export const networks = [
  mainnet,
  bsc,
  base,
  // 注意：Solana 需要单独处理，因为它不是 EVM 兼容链
  solana
] as [AppKitNetwork, ...AppKitNetwork[]]

// 3. 设置元数据
const metadata = {
  name: 'Trade AI',
  description: 'DeFi Trading Application',
  url: 'https://reown.com', // 您的应用域名
  icons: ['https://avatars.githubusercontent.com/u/179229932'] // 您的应用图标
}

// 4. 创建 Wagmi 适配器
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId
})

// Set up Solana Adapter
export const solanaWeb3JsAdapter = new SolanaAdapter()

// 5. 创建 AppKit 实例 - 简化配置专注于隐藏选项
export const appKit = createAppKit({
  adapters: [wagmiAdapter, solanaWeb3JsAdapter],
  networks,
  metadata,
  projectId,
  features: {
    analytics: false, // 禁用分析
    email: false, // 禁用邮箱登录
    socials: [] // 禁用社交登录
  },
  themeMode: 'dark', // 设置为暗色主题
  themeVariables: {
    '--w3m-color-mix': '#000000', // 主要混合色改为黑色
    '--w3m-color-mix-strength': 40, // 增加混合强度
    '--w3m-accent': '#10b981', // 保持绿色强调色
    '--w3m-border-radius-master': '8px',
    // 黑色主题变量
    '--w3m-background-color': '#000000',
    '--w3m-foreground-color': '#ffffff',
    '--w3m-overlay-background-color': 'rgba(0, 0, 0, 0.9)',
    '--w3m-container-border-color': '#333333',
    '--w3m-button-border-color': '#333333',
    '--w3m-secondary-button-background-color': '#111111',
    '--w3m-text-color': '#ffffff',
    '--w3m-text-secondary-color': '#a3a3a3'
  }
})

// 6. 导出 Wagmi 配置
export const config = wagmiAdapter.wagmiConfig

// 7. 网络配置映射
export const networkConfig = {
  [mainnet.id]: {
    name: 'Ethereum',
    symbol: 'ETH',
    icon: '⟠',
    color: '#627eea',
    chainId: mainnet.id
  },
  [bsc.id]: {
    name: 'BSC',
    symbol: 'BNB',
    icon: '🟡',
    color: '#f3ba2f',
    chainId: bsc.id
  },
  [base.id]: {
    name: 'Base',
    symbol: 'ETH',
    icon: '🔵',
    color: '#0052ff',
    chainId: base.id
  },
  // Solana 配置（需要单独处理）
  solana: {
    name: 'Solana',
    symbol: 'SOL',
    icon: '◎',
    color: '#9945ff',
    chainId: 'solana'
  }
} as const

// 8. 获取网络显示信息
export const getNetworkInfo = (chainId: number | string) => {
  return (
    networkConfig[chainId as keyof typeof networkConfig] || {
      name: 'Unknown',
      symbol: '?',
      icon: '❓',
      color: '#666666',
      chainId: chainId
    }
  )
}

// 9. 获取所有可用网络（包括 Solana）
export const getAllNetworks = () => {
  return [
    ...networks.map(chain => getNetworkInfo(chain.id)),
    getNetworkInfo('solana')
  ]
}

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
