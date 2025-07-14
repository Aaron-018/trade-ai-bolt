import { useState } from 'react'
export type SortDirection = 'asc' | 'desc' | null

export default function useTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  return {
    currentPage,
    setCurrentPage,
    isLoading,
    sortField,
    sortDirection
  }
}
