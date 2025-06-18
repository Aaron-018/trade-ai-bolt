import { lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@/components/Layout/Layout'

import Home from '../pages/home'
import List from '../pages/list'
import Channel from '../pages/channel'

const RoutesConfig = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/list" element={<List />} />
        <Route path="/channel" element={<Channel />} />
        {/* 重定向未匹配的路由到首页 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default RoutesConfig