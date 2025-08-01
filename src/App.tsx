import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { ToastContainer, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import WagmiProviderWrapper from './providers/WagmiProvider'
import PageRoutes from './routes'
import useAuth from './hooks/useAuth'
import { useSysStore, useChannelStore } from './store'

function App() {
  return (
    <WagmiProviderWrapper>
      <SkeletonTheme baseColor="#313131" highlightColor="#525252">
        <Entry />
        <ToastContainer
          // className="pl-[5%] pr-[5%] pt-5"
          // toastClassName="mb-4 min-h-8 rounded-lg"
          position="top-right"
          autoClose={2000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable={false}
          closeButton={false}
          pauseOnHover
          theme="dark"
          transition={Zoom}
        />
      </SkeletonTheme>
    </WagmiProviderWrapper>
  )
}

const Entry = () => {
  const getSysConfig = useSysStore(state => state.getSysConfig)

  const getChannels = useChannelStore(state => state.getChannels)

  const hasAuth = useAuth()

  useEffect(() => {
    getSysConfig()
  }, [getSysConfig])

  useEffect(() => {
    if (hasAuth) {
      getChannels()
    }
  }, [hasAuth, getChannels])

  return (
    <BrowserRouter>
      <PageRoutes />
    </BrowserRouter>
  )
}

export default App
