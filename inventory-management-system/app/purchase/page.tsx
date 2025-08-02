"use client"

import { useState } from "react"
import { Plus, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AddPurchaseModal } from "@/components/add-purchase-modal"

const initialPurchases = [
  {
    id: 1,
    batchNo: "BATCH001",
    product: "Wireless Headphones",
    quantity: 50,
    quantityRemaining: 45,
    costPrice: 75.0,
    supplier: "TechCorp Ltd",
    date: "2024-01-15",
  },
  {
    id: 2,
    batchNo: "BATCH002",
    product: "Coffee Beans",
    quantity: 25,
    quantityRemaining: 12,
    costPrice: 15.5,
    supplier: "Coffee Roasters Inc",
    date: "2024-01-14",
  },
  {
    id: 3,
    batchNo: "BATCH003",
    product: "Office Chair",
    quantity: 20,
    quantityRemaining: 8,
    costPrice: 120.0,
    supplier: "Furniture Plus",
    date: "2024-01-13",
  },
  {
    id: 4,
    batchNo: "BATCH004",
    product: "Notebook",
    quantity: 200,
    quantityRemaining: 150,
    costPrice: 2.5,
    supplier: "Stationery World",
    date: "2024-01-12",
  },
]

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState(initialPurchases)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)

  const handleAddPurchase = (newPurchase: any) => {
    setPurchases((prev) => [...prev, newPurchase])
  }

  const filteredPurchases = purchases.filter(
    (purchase) =>
      purchase.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.batchNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.supplier.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Purchases</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Track your purchase orders and inventory batches</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-teal-600 hover:bg-teal-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Purchase
        </Button>
      </div>

      <Card className="bg-white dark:bg-gray-800 shadow-sm w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900 dark:text-white">Purchase Orders</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search purchases..."
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
                  <TableHead>Batch No.</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead>Cost Price</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPurchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell className="font-mono text-sm">{purchase.batchNo}</TableCell>
                    <TableCell className="font-medium text-gray-900 dark:text-white">{purchase.product}</TableCell>
                    <TableCell>{purchase.quantity}</TableCell>
                    <TableCell>
                      <span
                        className={purchase.quantityRemaining === 0 ? "text-red-600" : "text-gray-900 dark:text-white"}
                      >
                        {purchase.quantityRemaining}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">${purchase.costPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">{purchase.supplier}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">{purchase.date}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          purchase.quantityRemaining === 0
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : purchase.quantityRemaining < purchase.quantity * 0.2
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        }
                      >
                        {purchase.quantityRemaining === 0
                          ? "Depleted"
                          : purchase.quantityRemaining < purchase.quantity * 0.2
                            ? "Low"
                            : "Available"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AddPurchaseModal open={showAddModal} onOpenChange={setShowAddModal} onAdd={handleAddPurchase} />
    </div>
  )
}
