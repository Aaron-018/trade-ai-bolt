import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useWallet } from '@/hooks/useWallet'
import clsxm from '@/utils/clsxm'

interface NetworkSelectorProps {
  className?: string
}

const NetworkSelector: React.FC<NetworkSelectorProps> = ({ className }) => {
  const { currentNetwork, availableNetworks, switchNetwork, isSwitching } =
    useWallet()
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0
  })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 计算下拉框位置
  const calculateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const dropdownHeight = Math.min(availableNetworks.length * 48 + 16, 250)

      // 检查是否有足够空间在下方显示
      const spaceBelow = viewportHeight - rect.bottom - 8
      const spaceAbove = rect.top - 8

      let top = rect.bottom + 4 // 默认在下方

      // 如果下方空间不足且上方空间更多，则在上方显示
      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        top = rect.top - dropdownHeight - 4
      }

      setDropdownPosition({
        top,
        left: rect.left,
        width: rect.width
      })
    }
  }

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      const isClickInButton =
        buttonRef.current && buttonRef.current.contains(target)
      const isClickInDropdown =
        dropdownRef.current && dropdownRef.current.contains(target)

      if (!isClickInButton && !isClickInDropdown) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      calculateDropdownPosition()

      const handleResize = () => {
        calculateDropdownPosition()
      }

      window.addEventListener('resize', handleResize)
      window.addEventListener('scroll', handleResize, true)

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('scroll', handleResize, true)
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleNetworkSelect = async (networkId: string | number) => {
    await switchNetwork(networkId)
    setIsOpen(false)
  }

  const handleToggle = () => {
    if (!isSwitching) {
      if (!isOpen) {
        calculateDropdownPosition()
      }
      setIsOpen(!isOpen)
    }
  }

  return (
    <div className={clsxm('relative', className)}>
      {/* 网络选择按钮 */}
      <motion.button
        ref={buttonRef}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleToggle}
        disabled={isSwitching}
        className={clsxm(
          'flex items-center space-x-2 rounded-lg border border-neutral-700 bg-neutral-800/80 px-3 py-2 backdrop-blur-sm',
          'text-sm text-defi-text transition-colors duration-200',
          'hover:border-neutral-600 focus:border-primary-500 focus:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          isOpen && 'border-primary-500'
        )}>
        {/* 网络图标和名称 */}
        <div className="flex items-center space-x-2">
          <span className="text-base" style={{ color: currentNetwork.color }}>
            {currentNetwork.icon}
          </span>
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

      {/* 网络选择下拉框 */}
      {isOpen &&
        createPortal(
          <AnimatePresence>
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              style={{
                position: 'fixed',
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
                zIndex: 9999
              }}
              className="overflow-hidden rounded-lg border border-neutral-700 bg-neutral-800 shadow-2xl">
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
                        'flex w-full items-center justify-between rounded-lg px-3 py-3 transition-colors',
                        'hover:bg-neutral-700/50 focus:bg-neutral-700/50 focus:outline-none',
                        isSelected &&
                          'border border-primary-500/30 bg-primary-500/10'
                      )}>
                      <div className="flex items-center space-x-3">
                        {/* 网络图标 */}
                        <span
                          className="text-lg"
                          style={{ color: network.color }}>
                          {network.icon}
                        </span>

                        {/* 网络信息 */}
                        <div className="text-left">
                          <div
                            className={clsxm(
                              'text-sm font-medium',
                              isSelected ? 'text-primary-400' : 'text-defi-text'
                            )}>
                            {network.name}
                          </div>
                          <div className="text-xs text-defi-text-muted">
                            {network.symbol}
                          </div>
                        </div>
                      </div>

                      {/* 选中指示器 */}
                      {isSelected && (
                        <Check className="h-4 w-4 text-primary-400" />
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
    </div>
  )
}

export default NetworkSelector
