import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './lib/store.ts'
import { Toaster } from 'sonner'
import LoadingSpinner from './components/LoadinSpinner.tsx'
import AuthLoader from './AuthLoader.tsx'
import { RouterProvider } from 'react-router-dom'
import router from './router.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <Toaster position="top-center" 
      style={{
        maxWidth: '90%',
        margin: 'auto'
      }}/>
      <Suspense fallback={<LoadingSpinner/>}>
      <AuthLoader>
        <RouterProvider router={router}/>
      </AuthLoader>
      </Suspense>
      {/* <App /> */}
    </Provider>

  </StrictMode>,
)
