import React from 'react'
import Modal from '@/components/Modal'
import WalletMonitorForm from './WalletMonitorForm'
import { IWalletStrategy } from '@/service/api/types'

interface EditWalletMonitorProps {
  isOpen: boolean
  data: IWalletStrategy
  onClose: () => void
}

const EditWalletMonitor: React.FC<EditWalletMonitorProps> = ({
  isOpen,
  data,
  onClose
}) => {
  const handleClose = () => {
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="编辑钱包监控"
      size="xl"
      className="max-w-2xl">
      <WalletMonitorForm
        isEdit
        data={data}
        onCancel={handleClose}
        onSuccess={handleClose}
      />
    </Modal>
  )
}

export default EditWalletMonitor
