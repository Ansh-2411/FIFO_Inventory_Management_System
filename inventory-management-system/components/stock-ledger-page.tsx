"use client"

import { useState } from "react"
import { Search, Filter, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const stockLedger = [
  {
    id: 1,
    saleId: "SALE001",
    customer: "John Smith",
    product: "Wireless Headphones",
    quantitySold: 2,
    saleDate: "2024-01-15",
    fifoBreakdown: [{ batchNo: "BATCH001", quantityUsed: 2, costPrice: 75.0, sellingPrice: 99.99 }],
  },
  {
    id: 2,
    saleId: "SALE002",
    customer: "Sarah Johnson",
    product: "Coffee Beans",
    quantitySold: 5,
    saleDate: "2024-01-15",
    fifoBreakdown: [{ batchNo: "BATCH002", quantityUsed: 5, costPrice: 15.5, sellingPrice: 25.0 }],
  },
  {
    id: 3,
    saleId: "SALE003",
    customer: "Mike Wilson",
    product: "Office Chair",
    quantitySold: 1,
    saleDate: "2024-01-14",
    fifoBreakdown: [{ batchNo: "BATCH003", quantityUsed: 1, costPrice: 120.0, sellingPrice: 180.0 }],
  },
  {
    id: 4,
    saleId: "SALE004",
    customer: "Emily Davis",
    product: "Notebook",
    quantitySold: 10,
    saleDate: "2024-01-14",
    fifoBreakdown: [{ batchNo: "BATCH004", quantityUsed: 10, costPrice: 2.5, sellingPrice: 4.99 }],
  },
]

export function StockLedgerPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedRows, setExpandedRows] = useState<number[]>([])

  const filteredLedger = stockLedger.filter(
    (entry) =>
      entry.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.saleId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleRowExpansion = (id: number) => {
    setExpandedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]))
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Stock Ledger</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">FIFO tracking for all sales transactions</p>
        </div>
      </div>

      <Card className="bg-white dark:bg-gray-800 shadow-sm w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900 dark:text-white">FIFO Stock Movement</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search ledger..."
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
          <div className="space-y-4 w-full">
            {filteredLedger.map((entry) => (
              <div key={entry.id} className="border border-gray-200 dark:border-gray-700 rounded-lg w-full">
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => toggleRowExpansion(entry.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="font-mono text-xs">
                        {entry.saleId}
                      </Badge>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{entry.product}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {entry.customer} • {entry.quantitySold} units • {entry.saleDate}
                        </p>
                      </div>
                    </div>
                    <ArrowRight
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        expandedRows.includes(entry.id) ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </div>

                {expandedRows.includes(entry.id) && (
                  <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                    <div className="p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">FIFO Breakdown:</h4>
                      <div className="w-full overflow-x-auto">
                        <Table className="w-full">
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-xs">Batch No.</TableHead>
                              <TableHead className="text-xs">Quantity Used</TableHead>
                              <TableHead className="text-xs">Cost Price</TableHead>
                              <TableHead className="text-xs">Selling Price</TableHead>
                              <TableHead className="text-xs">Profit</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {entry.fifoBreakdown.map((batch, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-mono text-xs">{batch.batchNo}</TableCell>
                                <TableCell className="text-xs">{batch.quantityUsed}</TableCell>
                                <TableCell className="text-xs">${batch.costPrice.toFixed(2)}</TableCell>
                                <TableCell className="text-xs">${batch.sellingPrice.toFixed(2)}</TableCell>
                                <TableCell className="text-xs font-medium text-green-600">
                                  ${((batch.sellingPrice - batch.costPrice) * batch.quantityUsed).toFixed(2)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
