import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import Dropdown from '@/components/DropDown'
import { useWallet } from '@/hooks/useWallet'
import clsxm from '@/utils/clsxm'

interface NetworkSelectorProps {
  className?: string
}

const NetworkSelector: React.FC<NetworkSelectorProps> = ({ className }) => {
  const { currentNetwork, availableNetworks, switchNetwork } = useWallet()
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const isSwitching = false

  const handleNetworkSelect = async (networkId: string | number) => {
    if (networkId !== currentNetwork.chainId) return
    await switchNetwork(networkId)
    setIsOpen(false)
  }

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  return (
    <Dropdown
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      menu={
        <div className="max-h-60 overflow-y-auto p-2">
          {availableNetworks.map(network => {
            const isSelected = network.chainId === currentNetwork.chainId

            return (
              <motion.button
                key={network.chainId}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNetworkSelect(network.chainId)}
                className={clsxm(
                  'flex w-full items-center justify-between rounded-lg px-2 py-2 transition-colors',
                  'hover:bg-neutral-700/50 focus:bg-neutral-700/50 focus:outline-none',
                  isSelected &&
                    'border border-primary-500/30 bg-primary-500/10',
                  network.chainId !== currentNetwork.chainId &&
                    'cursor-not-allowed opacity-30'
                )}>
                <div className="flex items-center space-x-3">
                  <img
                    className="h-6 w-6 rounded-full"
                    src={network.icon}
                    alt=""
                  />

                  {/* 网络信息 */}
                  <div className="text-left">
                    <div
                      className={clsxm(
                        'text-sm font-medium',
                        isSelected ? 'text-primary-400' : 'text-defi-text'
                      )}>
                      {network.name}
                    </div>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      }>
      <div className={clsxm('relative', className)}>
        {/* 网络选择按钮 */}
        <motion.button
          ref={buttonRef}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleToggle}
          className={clsxm(
            'flex items-center space-x-2 rounded-lg border border-neutral-700 bg-neutral-800/80 px-3 py-2 backdrop-blur-sm',
            'text-sm text-defi-text transition-colors duration-200',
            'hover:border-neutral-600 focus:border-primary-500 focus:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            isOpen && 'border-primary-500'
          )}>
          {/* 网络图标和名称 */}
          <div className="flex items-center space-x-2">
            <img
              className="h-6 w-6 rounded-full"
              src={currentNetwork.icon}
              alt=""
            />
            <span className="font-medium">{currentNetwork.name}</span>
          </div>

          {/* 下拉箭头或加载指示器 */}
          {isSwitching ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="h-4 w-4 rounded-full border-2 border-primary-400 border-t-transparent"
            />
          ) : (
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}>
              <ChevronDown className="h-4 w-4 text-defi-text-muted" />
            </motion.div>
          )}
        </motion.button>
      </div>
    </Dropdown>
  )
}

export default NetworkSelector
