import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Wallet, Unlink } from 'lucide-react'
import Dropdown from '@/components/DropDown'
import clsxm from '@/utils/clsxm'
import { superLong } from '@/utils/utils'
import { useUserStore } from '@/store'
import useLogin from '@/hooks/useLogin'

interface AccountProps {
  className?: string
}

const Account: React.FC<AccountProps> = ({ className }) => {
  const updateUserInfo = useUserStore(state => state.updateUserInfo)
  const { address, disconnectWallet } = useLogin()
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const disconnect = () => {
    updateUserInfo('')
    disconnectWallet()
  }

  return (
    <Dropdown
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      menu={
        <div
          className="flex cursor-pointer items-center space-x-2 p-2 hover:opacity-70"
          onClick={disconnect}>
          <Unlink className="h-4 w-4 text-error-500" />
          <span>Disconnect</span>
        </div>
      }>
      <div className={clsxm('relative', className)}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToggle}
          className="flex items-center space-x-3 rounded-lg border border-primary-500/30 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 px-4 py-2 transition-all duration-300 hover:border-primary-400/50">
          <Wallet className="h-5 w-5 text-primary-400" />
          <div className="font-mono text-sm text-defi-text">
            {superLong(address || '', 6)}
          </div>
        </motion.button>
      </div>
    </Dropdown>
  )
}

export default Account
