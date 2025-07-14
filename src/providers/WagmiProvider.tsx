import React from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { wagmiAdapter } from '@/config/wagmi'

// 创建 React Query 客户端
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 分钟
      gcTime: 1000 * 60 * 10 // 10 分钟
    }
  }
})

interface WagmiProviderWrapperProps {
  children: React.ReactNode
}

const WagmiProviderWrapper: React.FC<WagmiProviderWrapperProps> = ({
  children
}) => {
  // return <>{children}</>
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

export default WagmiProviderWrapper
