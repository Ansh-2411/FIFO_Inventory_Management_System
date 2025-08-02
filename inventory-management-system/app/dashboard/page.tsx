"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, TrendingUp, DollarSign, AlertTriangle } from "lucide-react"

export default function Dashboard() {
  const stats = [
    {
      title: "Total Products",
      value: "1,234",
      change: "+12%",
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Total Sales",
      value: "$45,231",
      change: "+8%",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Profit Margin",
      value: "23.5%",
      change: "+2.1%",
      icon: DollarSign,
      color: "text-teal-600",
    },
    {
      title: "Low Stock Items",
      value: "23",
      change: "-5",
      icon: AlertTriangle,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome back! Here's what's happening with your inventory.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <p className="text-xs text-green-600 mt-1">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Product {item}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Customer {item}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">${(Math.random() * 1000).toFixed(2)}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Today</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Low Stock Alert</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Product {item}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Only {Math.floor(Math.random() * 10)} left
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs rounded-full">
                      Low Stock
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
