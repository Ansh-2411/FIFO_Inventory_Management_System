"use client"

import { useState } from 'react'
import { Sidebar } from '@/components/inventory-sidebar'
import { Header } from '@/components/header'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/toaster'

interface AppWrapperProps {
  children: React.ReactNode
}

export function AppWrapper({ children }: AppWrapperProps) {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className={darkMode ? "dark" : ""}>
      <SidebarProvider>
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
          <Sidebar
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
          <div className="!w-[calc(100vw-255px)] flex-1 flex-col">
            <Header darkMode={darkMode} />
            <main className="flex-1 p-6 w-full">{children}</main>
          </div>
        </div>
        <Toaster />
      </SidebarProvider>
    </div>
  )
} 