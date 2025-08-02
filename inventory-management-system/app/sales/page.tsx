"use client"

import { useState } from "react"
import { Plus, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AddSaleModal } from "@/components/add-sale-modal"

const initialSales = [
  {
    id: 1,
    customer: "John Smith",
    product: "Wireless Headphones",
    quantity: 2,
    sellingPrice: 99.99,
    saleDate: "2024-01-15",
    total: 199.98,
  },
  {
    id: 2,
    customer: "Sarah Johnson",
    product: "Coffee Beans",
    quantity: 5,
    sellingPrice: 25.0,
    saleDate: "2024-01-15",
    total: 125.0,
  },
  {
    id: 3,
    customer: "Mike Wilson",
    product: "Office Chair",
    quantity: 1,
    sellingPrice: 180.0,
    saleDate: "2024-01-14",
    total: 180.0,
  },
  {
    id: 4,
    customer: "Emily Davis",
    product: "Notebook",
    quantity: 10,
    sellingPrice: 4.99,
    saleDate: "2024-01-14",
    total: 49.9,
  },
  {
    id: 5,
    customer: "Robert Brown",
    product: "Wireless Headphones",
    quantity: 1,
    sellingPrice: 99.99,
    saleDate: "2024-01-13",
    total: 99.99,
  },
]

export default function SalesPage() {
  const [sales, setSales] = useState(initialSales)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)

  const handleAddSale = (newSale: any) => {
    setSales((prev) => [...prev, newSale])
  }

  const filteredSales = sales.filter(
    (sale) =>
      sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.product.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sales</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Track your sales transactions and revenue</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-teal-600 hover:bg-teal-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Sale
        </Button>
      </div>

      <Card className="bg-white dark:bg-gray-800 shadow-sm w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900 dark:text-white">Sales Transactions</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search sales..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="w-full">
          <div className="w-full overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Sale Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium text-gray-900 dark:text-white">{sale.customer}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">{sale.product}</TableCell>
                    <TableCell>{sale.quantity}</TableCell>
                    <TableCell className="font-medium">${sale.sellingPrice.toFixed(2)}</TableCell>
                    <TableCell className="font-bold text-green-600">${sale.total.toFixed(2)}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">{sale.saleDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AddSaleModal open={showAddModal} onOpenChange={setShowAddModal} onAdd={handleAddSale} />
    </div>
  )
}
