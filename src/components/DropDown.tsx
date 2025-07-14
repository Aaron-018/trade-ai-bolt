import React, {
  ReactNode,
  ReactElement,
  useRef,
  useState,
  useEffect,
  cloneElement
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import clsxm from '@/utils/clsxm'

interface DropdownProps {
  isOpen: boolean
  onOpen?: () => void
  onClose: () => void
  menu: ReactNode
  children: ReactElement
  dropdownClassName?: string
}

const Dropdown: React.FC<DropdownProps> = ({
  isOpen,
  onOpen,
  onClose,
  menu,
  children,
  dropdownClassName
}) => {
  const triggerRef = useRef<HTMLElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [position, setPosition] = useState({
    width: 0,
    top: 0,
    left: 0
  })

  const handleClose = useRef(onClose)
  useEffect(() => {
    handleClose.current = onClose
  }, [onClose])

  const calculatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      // const viewportHeight = window.innerHeight
      setPosition({
        width: rect.width,
        top: rect.bottom + 4,
        left: rect.left
      })
    }
  }

  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        triggerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) {
        return
      }
      handleClose.current?.()
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  useEffect(() => {
    isOpen && calculatePosition()
  }, [isOpen])

  const trigger = cloneElement(children, {
    ref: triggerRef,
    onClick: (e: React.MouseEvent) => {
      children.props.onClick?.(e)
      isOpen ? onClose() : onOpen?.()
    }
  })

  return (
    <>
      {trigger}
      {createPortal(
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15, ease: 'easeInOut' }}
              style={{
                position: 'fixed',
                top: position.top,
                left: position.left,
                minWidth: position.width,
                // width: 'auto',
                zIndex: 9999
              }}
              className={clsxm(
                'overflow-hidden rounded-lg border border-neutral-700 bg-neutral-800 shadow-2xl',
                dropdownClassName
              )}>
              {menu}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}

export default Dropdown
