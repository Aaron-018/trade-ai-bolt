import React, { lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@/components/Layout/Layout'

import Home from '../pages/home'
const Strategy = lazy(() => import('../pages/strategy'))
const Channel = lazy(() => import('../pages/channel'))
const CexMonitor = lazy(() => import('../pages/cex'))
const CexToken = lazy(() => import('../pages/cex-token'))
const Notifications = lazy(() => import('../pages/notifications'))
// import Strategy from '../pages/strategy'
// import Channel from '../pages/channel'
// import CexMonitor from '../pages/cex'
// import Notifications from '../pages/notifications'

export const lazyload = (Cmp: any) => {
  return (
    <React.Suspense fallback={null}>
      <Cmp />
    </React.Suspense>
  )
}

const RoutesConfig = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/strategy" element={lazyload(Strategy)} />
        <Route path="/channel" element={lazyload(Channel)} />
        <Route path="/cex" element={lazyload(CexMonitor)} />
        <Route path="/cex-token/:symbol" element={lazyload(CexToken)} />
        <Route path="/notifications" element={lazyload(Notifications)} />
        {/* 重定向未匹配的路由到首页 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default RoutesConfig
