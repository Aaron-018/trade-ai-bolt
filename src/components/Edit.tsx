import { FC, ReactNode, useState } from 'react'
import { motion } from 'framer-motion'
import { SquarePen, Check, X as Close } from 'lucide-react'
import Input from '@/components/Input'

interface EditProps {
  value: string
  onEdit: (value: string) => void
  onSave: () => Promise<boolean>
  children: ReactNode
}
const Edit: FC<EditProps> = ({ value, onEdit, onSave, children }) => {
  const [isEdit, setIsEdit] = useState(false)
  const [loading, setLoading] = useState(false)

  const toggleEdit = (edit: boolean) => {
    setIsEdit(edit)
    setLoading(false)
  }

  const handleSave = async () => {
    setLoading(true)
    const res = await onSave()
    if (res) setIsEdit(false)
    setLoading(false)
  }

  return (
    <div className="flex items-center space-x-2">
      {isEdit ? (
        <>
          <div className="flex items-center space-x-2">
            <Input value={value} onChange={onEdit} className="w-28" />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-defi-text-muted transition-colors hover:text-primary-400"
              onClick={() => toggleEdit(false)}>
              <Close className="h-4 w-4" />
            </motion.button>
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="ml-2">
                <div className="h-4 w-4 rounded-full border-2 border-defi-text-muted border-t-transparent" />
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-defi-text-muted transition-colors hover:text-primary-400"
                onClick={handleSave}>
                <Check className="h-4 w-4" />
              </motion.button>
            )}
          </div>
        </>
      ) : (
        <>
          {children}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-defi-text-muted transition-colors hover:text-primary-400"
            onClick={() => toggleEdit(true)}>
            <SquarePen className="h-4 w-4" />
          </motion.button>
        </>
      )}
    </div>
  )
}

export default Edit
