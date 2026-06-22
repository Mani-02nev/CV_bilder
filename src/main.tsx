import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from 'sonner'
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <App />
          <Toaster
            position="top-center"
            theme="dark"
            closeButton
            toastOptions={{
              style: {
                background: 'rgba(9, 13, 22, 0.9)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#f8fafc',
                borderRadius: '16px',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                fontFamily: "Inter, system-ui, -apple-system, sans-serif",
              },
              classNames: {
                toast: 'group border-slate-800/80 font-sans shadow-2xl flex items-center w-full max-w-[380px] sm:max-w-md pointer-events-auto',
                title: 'text-slate-100 font-medium text-sm',
                description: 'text-slate-400 text-xs mt-0.5',
                actionButton: 'bg-indigo-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-indigo-500 transition-colors',
                cancelButton: 'bg-slate-800 text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-slate-700 transition-colors',
                success: 'border-l-4 border-l-emerald-500 bg-[#061c15]/90',
                error: 'border-l-4 border-l-rose-500 bg-[#1f0e11]/90',
                info: 'border-l-4 border-l-sky-500 bg-[#0c1824]/90',
                warning: 'border-l-4 border-l-amber-500 bg-[#1f160c]/90',
              }
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
