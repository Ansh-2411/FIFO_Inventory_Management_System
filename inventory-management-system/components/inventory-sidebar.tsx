"use client"

import {
  BarChart3,
  Package,
  FolderOpen,
  ShoppingCart,
  TrendingUp,
  FileText,
  Truck,
  Users,
  MessageSquare,
  ImageIcon,
  Moon,
  Sun,
} from "lucide-react"
import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "products", label: "Products", icon: Package },
  { id: "categories", label: "Categories", icon: FolderOpen },
  { id: "purchases", label: "Purchases", icon: ShoppingCart },
  { id: "sales", label: "Sales", icon: TrendingUp },
  { id: "stock-ledger", label: "Stock Ledger", icon: FileText },
  { id: "suppliers", label: "Suppliers", icon: Truck },
  { id: "customers", label: "Customers", icon: Users },
  { id: "feedback", label: "Feedback", icon: MessageSquare },
  { id: "images", label: "Images", icon: ImageIcon },
]

interface SidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
  darkMode: boolean
  setDarkMode: (darkMode: boolean) => void
}

export function Sidebar({ activeSection, setActiveSection, darkMode, setDarkMode }: SidebarProps) {
  return (
    <SidebarPrimitive className="border-r border-gray-200 dark:border-gray-700">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Inventory App</h1>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveSection(item.id)}
                    isActive={activeSection === item.id}
                    className="w-full justify-start gap-3 px-3 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-700 dark:hover:text-teal-300 data-[active=true]:bg-teal-100 dark:data-[active=true]:bg-teal-900/30 data-[active=true]:text-teal-700 dark:data-[active=true]:text-teal-300"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDarkMode(!darkMode)}
          className="w-full justify-start gap-3 text-gray-700 dark:text-gray-300"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {darkMode ? "Light Mode" : "Dark Mode"}
        </Button>
      </SidebarFooter>
    </SidebarPrimitive>
  )
}
