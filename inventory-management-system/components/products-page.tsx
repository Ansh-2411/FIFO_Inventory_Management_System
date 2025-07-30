"use client"

import { useState } from "react"
import { Plus, Search, Filter, Edit, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AddProductModal } from "@/components/add-product-modal"

const initialProducts = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    unit: "pcs",
    stock: 45,
    image: "/placeholder.svg?height=40&width=40",
    status: "In Stock",
  },
  {
    id: 2,
    name: "Coffee Beans",
    category: "Food & Beverage",
    unit: "kg",
    stock: 12,
    image: "/placeholder.svg?height=40&width=40",
    status: "Low Stock",
  },
  {
    id: 3,
    name: "Office Chair",
    category: "Furniture",
    unit: "pcs",
    stock: 8,
    image: "/placeholder.svg?height=40&width=40",
    status: "Low Stock",
  },
  {
    id: 4,
    name: "Notebook",
    category: "Stationery",
    unit: "pcs",
    stock: 150,
    image: "/placeholder.svg?height=40&width=40",
    status: "In Stock",
  },
  {
    id: 5,
    name: "Smartphone",
    category: "Electronics",
    unit: "pcs",
    stock: 0,
    image: "/placeholder.svg?height=40&width=40",
    status: "Out of Stock",
  },
]

export function ProductsPage() {
  const [products, setProducts] = useState(initialProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)

  const handleAddProduct = (newProduct: any) => {
    const productWithDefaults = {
      ...newProduct,
      stock: 0,
      image: "/placeholder.svg?height=40&width=40",
      status: "Out of Stock",
    }
    setProducts((prev) => [...prev, productWithDefaults])
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Out of Stock":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your product inventory</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-teal-600 hover:bg-teal-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Card className="bg-white dark:bg-gray-800 shadow-sm w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900 dark:text-white">Product List</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search products..."
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
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Stock Available</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={product.image || "/placeholder.svg"} alt={product.name} />
                          <AvatarFallback>{product.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-gray-900 dark:text-white">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">{product.category}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">{product.unit}</TableCell>
                    <TableCell className="font-medium text-gray-900 dark:text-white">{product.stock}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(product.status)}>{product.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AddProductModal open={showAddModal} onOpenChange={setShowAddModal} onAdd={handleAddProduct} />
    </div>
  )
}
