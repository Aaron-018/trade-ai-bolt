import { lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import Home from '../pages/home'
import List from '../pages/list'

const RoutesConfig = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/list" element={<List />} />
    </Routes>
  )
}

export default RoutesConfig
