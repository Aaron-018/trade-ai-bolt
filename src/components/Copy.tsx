import { FC } from 'react'
import { motion } from 'framer-motion'
import { Copy as CopyIcon } from 'lucide-react'
import CopyToClipboard, { CopyToClipboardProps } from './CopyToClipboard'

const Copy: FC<Omit<CopyToClipboardProps, 'children'>> = props => {
  return (
    <CopyToClipboard text={props.text}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="text-defi-text-muted transition-colors hover:text-primary-400">
        <CopyIcon className="h-4 w-4" />
      </motion.button>
    </CopyToClipboard>
  )
}

export default Copy
