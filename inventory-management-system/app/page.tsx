"use client"

import { useState } from "react"
import { Sidebar } from "@/components/inventory-sidebar"
import { Header } from "@/components/header"
import { Dashboard } from "@/components/dashboard"
import { ProductsPage } from "@/components/products-page"
import { CategoriesPage } from "@/components/categories-page"
import { PurchasesPage } from "@/components/purchases-page"
import { SalesPage } from "@/components/sales-page"
import { StockLedgerPage } from "@/components/stock-ledger-page"
import { SuppliersPage } from "@/components/suppliers-page"
import { CustomersPage } from "@/components/customers-page"
import { FeedbackPage } from "@/components/feedback-page"
import { ImagesPage } from "@/components/images-page"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function InventoryApp() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [darkMode, setDarkMode] = useState(false)

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />
      case "products":
        return <ProductsPage />
      case "categories":
        return <CategoriesPage />
      case "purchases":
        return <PurchasesPage />
      case "sales":
        return <SalesPage />
      case "stock-ledger":
        return <StockLedgerPage />
      case "suppliers":
        return <SuppliersPage />
      case "customers":
        return <CustomersPage />
      case "feedback":
        return <FeedbackPage />
      case "images":
        return <ImagesPage />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <SidebarProvider>
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
          <Sidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
          <div className="!w-[calc(100vw-255px)] flex-1 flex-col">
            <Header darkMode={darkMode} />
            <main className="flex-1 p-6 w-full">{renderContent()}</main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  )
}
