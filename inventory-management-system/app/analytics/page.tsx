"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid } from "recharts"
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Package, 
  RefreshCw,
  AlertTriangle,
  Calendar,
  Users,
  TrendingDown,
  Eye,
  Target,
  Zap,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Percent
} from "lucide-react"

interface SalesAnalytics {
  success: boolean
  summary: {
    totalProducts: number
    totalSales: number
    totalRevenue: string
    totalProfit: string
  }
  monthlySales: Array<{
    month: string
    total_sales: string
  }>
  monthlyProfit: Array<{
    month: string
    total_profit: string
  }>
  lowStockItems: Array<any>
  recentSales: Array<{
    sale_id: number
    product_id: number
    customer_id: number
    sale_date: string
    selling_price: string
    product_name: string
    customer_name: string
  }>
}

interface SalesPrediction {
  success: boolean
  message: string
  total_predicted_sales: string
  predictions: Array<{
    product_id: string
    product_name: string
    current_stock: number
    predicted_sales: string
    required_stock: string
    unit: string
  }>
}

interface MonthlySalesData {
  success: boolean
  data: Array<{
    month: string
    total_sales: string
  }>
}

interface SalesByProductData {
  success: boolean
  data: Array<{
    product_id: number
    total_quantity: string
    total_revenue: string
    Product: {
      name: string
    }
  }>
}

interface LowStockData {
  success: boolean
  data: Array<{
    product_id: number
    name: string
    unit: string
    quantity_remaining: string
  }>
}

interface ProfitByProductData {
  success: boolean
  data: Array<{
    product_id: number
    product_name: string
    total_revenue: number
    total_cost: number
    profit: string
    profit_margin: string
  }>
}

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState<SalesAnalytics | null>(null)
  const [predictionData, setPredictionData] = useState<SalesPrediction | null>(null)
  const [monthlySalesData, setMonthlySalesData] = useState<MonthlySalesData | null>(null)
  const [salesByProductData, setSalesByProductData] = useState<SalesByProductData | null>(null)
  const [lowStockData, setLowStockData] = useState<LowStockData | null>(null)
  const [profitByProductData, setProfitByProductData] = useState<ProfitByProductData | null>(null)
  const [loading, setLoading] = useState(true)
  const [predictionLoading, setPredictionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [predictionError, setPredictionError] = useState<string | null>(null)

  const fetchAnalyticsData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Fetch all data in parallel
      const [
        analyticsResponse,
        monthlySalesResponse,
        salesByProductResponse,
        lowStockResponse,
        profitByProductResponse
      ] = await Promise.all([
        fetch('http://localhost:3005/api/sales/analytics'),
        fetch('http://localhost:3005/api/sales/monthly-sales'),
        fetch('http://localhost:3005/api/sales/sales-by-product'),
        fetch('http://localhost:3005/api/sales/low-stock'),
        fetch('http://localhost:3005/api/sales/profit-by-product')
      ])

      // Check if all responses are ok
      const responses = [analyticsResponse, monthlySalesResponse, salesByProductResponse, lowStockResponse, profitByProductResponse]
      const failedResponse = responses.find(response => !response.ok)
      if (failedResponse) {
        throw new Error(`HTTP error! status: ${failedResponse.status}`)
      }

      // Parse all responses
      const [analyticsResult, monthlySalesResult, salesByProductResult, lowStockResult, profitByProductResult] = await Promise.all([
        analyticsResponse.json(),
        monthlySalesResponse.json(),
        salesByProductResponse.json(),
        lowStockResponse.json(),
        profitByProductResponse.json()
      ])

      // Set all data
      if (analyticsResult.success) {
        setAnalyticsData(analyticsResult)
      }
      if (monthlySalesResult.success) {
        setMonthlySalesData(monthlySalesResult)
      }
      if (salesByProductResult.success) {
        setSalesByProductData(salesByProductResult)
      }
      if (lowStockResult.success) {
        setLowStockData(lowStockResult)
      }
      if (profitByProductResult.success) {
        setProfitByProductData(profitByProductResult)
      }

    } catch (err) {
      console.error('Error fetching analytics data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics data')
    } finally {
      setLoading(false)
    }
  }

  const fetchPredictionData = async () => {
    setPredictionLoading(true)
    setPredictionError(null)
    
    try {
      const response = await fetch('http://localhost:3005/api/sales/predict')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.success) {
        setPredictionData(result)
      } else {
        throw new Error('Failed to fetch prediction data')
      }
    } catch (err) {
      console.error('Error fetching prediction data:', err)
      setPredictionError(err instanceof Error ? err.message : 'Failed to fetch prediction data')
    } finally {
      setPredictionLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numAmount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatMonth = (monthString: string) => {
    const date = new Date(monthString + '-01')
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })
  }

  // Chart configurations
  const chartConfig = {
    total_sales: {
      label: "Total Sales",
      color: "hsl(var(--chart-1))",
    },
    total_revenue: {
      label: "Total Revenue",
      color: "hsl(var(--chart-2))",
    },
    total_quantity: {
      label: "Total Quantity",
      color: "hsl(var(--chart-3))",
    },
    profit: {
      label: "Profit",
      color: "hsl(var(--chart-4))",
    },
    quantity_remaining: {
      label: "Quantity Remaining",
      color: "hsl(var(--chart-5))",
    },
  }

  // Process data for charts
  const processedMonthlySales = monthlySalesData?.data?.map(item => ({
    month: item.month.split('-')[1], // Extract month number
    total_sales: parseInt(item.total_sales)
  })) || []

  const processedSalesByProduct = salesByProductData?.data?.map(item => ({
    name: item.Product.name,
    total_quantity: parseInt(item.total_quantity),
    total_revenue: parseInt(item.total_revenue)
  })) || []

  const processedLowStock = lowStockData?.data?.map(item => ({
    name: item.name,
    value: parseInt(item.quantity_remaining) || 0
  })).filter(item => item.value >= 0) || []

  const processedProfitByProduct = profitByProductData?.data?.map(item => ({
    name: item.product_name,
    profit: parseFloat(item.profit),
    total_revenue: item.total_revenue,
    total_cost: item.total_cost
  })) || []

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

  if (loading) {
    return (
      <div className="space-y-6 w-full">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sales Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Comprehensive sales insights and predictions for your business.
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-6 h-6 animate-spin text-gray-400 mr-2" />
          <span className="text-gray-500">Loading analytics data...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6 w-full">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sales Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Comprehensive sales insights and predictions for your business.
          </p>
        </div>
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">
            Error: {error}
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchAnalyticsData}
            className="mt-2"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="space-y-6 w-full">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sales Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Comprehensive sales insights and predictions for your business.
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No analytics data available</p>
        </div>
      </div>
    )
  }

  const summaryStats = [
    {
      title: "Total Products",
      value: analyticsData.summary.totalProducts.toString(),
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      iconBg: "bg-blue-100 dark:bg-blue-900/40",
    },
    {
      title: "Total Sales",
      value: analyticsData.summary.totalSales.toString(),
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      iconBg: "bg-green-100 dark:bg-green-900/40",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(analyticsData.summary.totalRevenue),
      icon: DollarSign,
      color: "text-teal-600",
      bgColor: "bg-teal-50 dark:bg-teal-900/20",
      iconBg: "bg-teal-100 dark:bg-teal-900/40",
    },
    {
      title: "Total Profit",
      value: formatCurrency(analyticsData.summary.totalProfit),
      icon: parseFloat(analyticsData.summary.totalProfit) >= 0 ? TrendingUp : TrendingDown,
      color: parseFloat(analyticsData.summary.totalProfit) >= 0 ? "text-green-600" : "text-red-600",
      bgColor: parseFloat(analyticsData.summary.totalProfit) >= 0 ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20",
      iconBg: parseFloat(analyticsData.summary.totalProfit) >= 0 ? "bg-green-100 dark:bg-green-900/40" : "bg-red-100 dark:bg-red-900/40",
    },
  ]

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sales Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Comprehensive sales insights and predictions for your business.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchAnalyticsData}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Analytics
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchPredictionData}
            disabled={predictionLoading}
          >
            <Eye className={`w-4 h-4 mr-2 ${predictionLoading ? 'animate-spin' : ''}`} />
            Generate Predictions
          </Button>
        </div>
      </div>

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analytics">Sales Analytics</TabsTrigger>
          <TabsTrigger value="predictions">Sales Predictions</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {summaryStats.map((stat, index) => (
              <Card key={index} className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 border-0 overflow-hidden relative group">
                <div className={`absolute inset-0 ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-lg ${stat.iconBg} transition-all duration-300 group-hover:scale-110`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
                  <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full ${stat.bgColor.replace('bg-', 'bg-gradient-to-r from-').replace('/20', ' to-transparent')} w-3/4 rounded-full transition-all duration-1000 delay-300`}></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Monthly Sales and Profit Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                  </div>
                  Monthly Sales
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {analyticsData.monthlySales.length === 0 ? (
                    <div className="text-center py-8">
                      <Activity className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-500">No monthly sales data available</p>
                    </div>
                  ) : (
                    analyticsData.monthlySales.map((sale, index) => (
                      <div key={index} className="group flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl border border-green-100 dark:border-green-800/30 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg group-hover:scale-110 transition-transform duration-300">
                            <Calendar className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900 dark:text-white">{formatMonth(sale.month)}</span>
                            <div className="flex items-center gap-1 mt-1">
                              <ArrowUpRight className="w-3 h-3 text-green-500" />
                              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Sales</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-bold text-green-600">{formatCurrency(sale.total_sales)}</span>
                          <div className="w-16 h-2 bg-green-200 dark:bg-green-800 rounded-full mt-1">
                            <div className="h-full bg-green-500 rounded-full w-3/4 transition-all duration-1000 delay-300"></div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  Monthly Profit
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {analyticsData.monthlyProfit.length === 0 ? (
                    <div className="text-center py-8">
                      <Activity className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-500">No monthly profit data available</p>
                    </div>
                  ) : (
                    analyticsData.monthlyProfit.map((profit, index) => {
                      const profitValue = parseFloat(profit.total_profit)
                      const isPositive = profitValue >= 0
                      return (
                        <div key={index} className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-300 hover:shadow-md ${
                          isPositive 
                            ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-green-100 dark:border-green-800/30'
                            : 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/10 dark:to-pink-900/10 border-red-100 dark:border-red-800/30'
                        }`}>
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg group-hover:scale-110 transition-transform duration-300 ${
                              isPositive ? 'bg-green-100 dark:bg-green-900/40' : 'bg-red-100 dark:bg-red-900/40'
                            }`}>
                              <Calendar className={`w-4 h-4 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
                            </div>
                            <div>
                              <span className="font-semibold text-gray-900 dark:text-white">{formatMonth(profit.month)}</span>
                              <div className="flex items-center gap-1 mt-1">
                                {isPositive ? (
                                  <>
                                    <ArrowUpRight className="w-3 h-3 text-green-500" />
                                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">Profit</span>
                                  </>
                                ) : (
                                  <>
                                    <ArrowDownRight className="w-3 h-3 text-red-500" />
                                    <span className="text-xs text-red-600 dark:text-red-400 font-medium">Loss</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`text-xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(profitValue)}
                            </span>
                            <div className={`w-16 h-2 rounded-full mt-1 ${
                              isPositive ? 'bg-green-200 dark:bg-green-800' : 'bg-red-200 dark:bg-red-800'
                            }`}>
                              <div className={`h-full rounded-full w-3/4 transition-all duration-1000 delay-300 ${
                                isPositive ? 'bg-green-500' : 'bg-red-500'
                              }`}></div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Sales Line Chart */}
            <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  Monthly Sales Trend
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {processedMonthlySales.length > 0 ? (
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <LineChart data={processedMonthlySales}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="month" 
                        tickFormatter={(value) => `Month ${value}`}
                      />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="total_sales" 
                        stroke="var(--color-total_sales)" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ChartContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="text-gray-500">No monthly sales data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sales by Product Bar Chart */}
            <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                  </div>
                  Sales by Product
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {processedSalesByProduct.length > 0 ? (
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <BarChart data={processedSalesByProduct}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="total_quantity" fill="var(--color-total_quantity)" />
                    </BarChart>
                  </ChartContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="text-gray-500">No sales by product data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Low Stock Pie Chart */}
            <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                  </div>
                  Low Stock Items
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {processedLowStock.length > 0 ? (
                  <div className="space-y-4">
                    <ChartContainer config={chartConfig} className="h-[250px]">
                      <PieChart>
                        <Pie
                          data={processedLowStock}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={70}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {processedLowStock.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ChartContainer>
                    <div className="space-y-2">
                      {processedLowStock.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            ></div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</span>
                          </div>
                          <span className={`text-sm font-bold ${
                            item.value === 0 ? 'text-red-600' : 'text-orange-600'
                          }`}>
                            {item.value === 0 ? 'Out of Stock' : `${item.value} remaining`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="text-gray-500">No low stock items</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Profit by Product Bar Chart */}
            <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                  </div>
                  Profit by Product
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {processedProfitByProduct.length > 0 ? (
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <BarChart data={processedProfitByProduct}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis />
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        formatter={(value, name) => [
                          name === 'profit' ? formatCurrency(Number(value)) : value,
                          name === 'profit' ? 'Profit' : name
                        ]}
                      />
                      <Bar 
                        dataKey="profit" 
                        fill="var(--color-profit)"
                      />
                    </BarChart>
                  </ChartContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="text-gray-500">No profit data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Sales */}
          <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20">
              <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                <div className="p-2 bg-teal-100 dark:bg-teal-900/40 rounded-lg">
                  <Users className="w-5 h-5 text-teal-600" />
                </div>
                Recent Sales
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {analyticsData.recentSales.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500">No recent sales found</p>
                  </div>
                ) : (
                  analyticsData.recentSales.map((sale) => (
                    <div key={sale.sale_id} className="group flex items-center justify-between p-5 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/10 dark:to-cyan-900/10 rounded-xl border border-teal-100 dark:border-teal-800/30 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/40 dark:to-cyan-900/40 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                          <Package className="w-7 h-7 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div>
                          <p className="font-bold text-lg text-gray-900 dark:text-white">{sale.product_name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Users className="w-4 h-4 text-gray-400" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">{sale.customer_name}</p>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 px-2 py-1 rounded-full">
                              ID: #{sale.sale_id}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-2xl text-teal-600 dark:text-teal-400 mb-1">{formatCurrency(sale.selling_price)}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(sale.sale_date)}</p>
                        <div className="flex items-center gap-1 mt-2 justify-end">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-green-600 dark:text-green-400 font-medium">Completed</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Low Stock Items */}
          {analyticsData.lowStockItems.length > 0 && (
            <Card className="bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  Low Stock Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.lowStockItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{item.product_name || 'Unknown Product'}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Low stock alert</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs rounded-full bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200">
                        Low Stock
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          {predictionError && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">
                Error: {predictionError}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchPredictionData}
                className="mt-2"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          )}

          {predictionLoading && (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="w-6 h-6 animate-spin text-gray-400 mr-2" />
              <span className="text-gray-500">Generating predictions...</span>
            </div>
          )}

          {predictionData && (
            <>
              {/* Prediction Summary */}
              <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                      <Target className="w-5 h-5 text-blue-600" />
                    </div>
                    Prediction Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-blue-600" />
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Predicted Sales</p>
                      </div>
                      <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {formatCurrency(predictionData.total_predicted_sales)}
                      </p>
                      <div className="w-full h-3 bg-blue-100 dark:bg-blue-900/40 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full w-full transition-all duration-2000 delay-500"></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-green-600" />
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</p>
                      </div>
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800/30">
                        <p className="text-sm text-green-700 dark:text-green-300 font-medium">{predictionData.message}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Product Predictions */}
              <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                      <Package className="w-5 h-5 text-purple-600" />
                    </div>
                    Product Predictions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {predictionData.predictions.length === 0 ? (
                      <div className="text-center py-12">
                        <Target className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No predictions available</p>
                      </div>
                    ) : (
                      predictionData.predictions.map((prediction, index) => {
                        const isStockSufficient = prediction.current_stock > parseFloat(prediction.required_stock)
                        const stockPercentage = Math.min((prediction.current_stock / parseFloat(prediction.required_stock)) * 100, 100)
                        
                        return (
                          <div key={index} className="group p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-2xl border border-purple-100 dark:border-purple-800/30 hover:shadow-xl transition-all duration-300">
                            {/* Product Header */}
                            <div className="flex items-center gap-4 mb-6">
                              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <Package className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{prediction.product_name}</h3>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full">
                                    ID: {prediction.product_id}
                                  </span>
                                  <span className="text-sm text-gray-500 dark:text-gray-400">• {prediction.unit}</span>
                                </div>
                              </div>
                              <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                isStockSufficient 
                                  ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' 
                                  : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
                              }`}>
                                {isStockSufficient ? '✓ Sufficient Stock' : '⚠ Stock Needed'}
                              </div>
                            </div>

                            {/* Prediction Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                  <Activity className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Stock</span>
                                </div>
                                <p className="text-2xl font-bold text-blue-600">{prediction.current_stock}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{prediction.unit}</p>
                              </div>
                              
                              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                  <TrendingUp className="w-4 h-4 text-green-600" />
                                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Predicted Sales</span>
                                </div>
                                <p className="text-2xl font-bold text-green-600">{formatCurrency(prediction.predicted_sales)}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Revenue</p>
                              </div>
                              
                              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                  <Target className="w-4 h-4 text-orange-600" />
                                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Required Stock</span>
                                </div>
                                <p className="text-2xl font-bold text-orange-600">{formatCurrency(prediction.required_stock)}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{prediction.unit}</p>
                              </div>
                            </div>

                            {/* Stock Progress Bar */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Stock Coverage</span>
                                <span className="text-sm font-bold text-gray-900 dark:text-white">{stockPercentage.toFixed(1)}%</span>
                              </div>
                              <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-2000 delay-300 ${
                                    isStockSufficient 
                                      ? 'bg-gradient-to-r from-green-400 to-green-600' 
                                      : 'bg-gradient-to-r from-red-400 to-red-600'
                                  }`}
                                  style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                                ></div>
                              </div>
                              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                <span>0 {prediction.unit}</span>
                                <span>{prediction.required_stock} {prediction.unit} (Required)</span>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {!predictionData && !predictionLoading && !predictionError && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center max-w-md">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Eye className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Ready to Predict Sales?</h3>
                <p className="text-gray-500 mb-6">Generate AI-powered sales predictions to optimize your inventory and maximize revenue.</p>
                <Button onClick={fetchPredictionData} size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Generate Predictions
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
