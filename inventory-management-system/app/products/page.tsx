"use client"

import { useState } from "react"
import { Plus, Search, Filter, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AddProductModal } from "@/components/add-product-modal"
import { useRouter } from "next/navigation"

const initialProducts = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    unit: "pcs",
    stock: 45,
    price: 99.99,
    image: "/placeholder.svg?height=200&width=200",
    images: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
    status: "In Stock",
    description:
      "Premium wireless headphones with noise cancellation and superior sound quality. Perfect for music lovers and professionals.",
    rating: 4.5,
    reviews: 128,
    features: ["Noise Cancellation", "30-hour Battery", "Bluetooth 5.0", "Quick Charge"],
  },
  {
    id: 2,
    name: "Coffee Beans",
    category: "Food & Beverage",
    unit: "kg",
    stock: 12,
    price: 25.0,
    image: "/placeholder.svg?height=200&width=200",
    images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
    status: "Low Stock",
    description:
      "Premium arabica coffee beans sourced from the finest coffee farms. Rich flavor and aromatic experience.",
    rating: 4.8,
    reviews: 89,
    features: ["100% Arabica", "Single Origin", "Medium Roast", "Fair Trade"],
  },
  {
    id: 3,
    name: "Office Chair",
    category: "Furniture",
    unit: "pcs",
    stock: 8,
    price: 180.0,
    image: "/placeholder.svg?height=200&width=200",
    images: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
    status: "Low Stock",
    description: "Ergonomic office chair designed for comfort and productivity. Adjustable height and lumbar support.",
    rating: 4.3,
    reviews: 67,
    features: ["Ergonomic Design", "Adjustable Height", "Lumbar Support", "360° Swivel"],
  },
  {
    id: 4,
    name: "Notebook",
    category: "Stationery",
    unit: "pcs",
    stock: 150,
    price: 4.99,
    image: "/placeholder.svg?height=200&width=200",
    images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
    status: "In Stock",
    description: "High-quality spiral notebook with lined pages. Perfect for students and professionals.",
    rating: 4.1,
    reviews: 234,
    features: ["200 Pages", "Spiral Bound", "Lined Pages", "Durable Cover"],
  },
  {
    id: 5,
    name: "Smartphone",
    category: "Electronics",
    unit: "pcs",
    stock: 0,
    price: 699.99,
    image: "/placeholder.svg?height=200&width=200",
    images: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
    status: "Out of Stock",
    description: "Latest smartphone with advanced camera system and powerful processor. Stay connected in style.",
    rating: 4.6,
    reviews: 456,
    features: ["5G Ready", "Triple Camera", "Fast Charging", "Water Resistant"],
  },
]

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const router = useRouter()

  const handleAddProduct = (newProduct: any) => {
    const productWithDefaults = {
      ...newProduct,
      id: Date.now(),
      stock: 0,
      price: 0,
      image: "/placeholder.svg?height=200&width=200",
      images: ["/placeholder.svg?height=400&width=400"],
      status: "Out of Stock",
      description: "Product description will be added soon.",
      rating: 0,
      reviews: 0,
      features: [],
    }
    setProducts((prev) => [...prev, productWithDefaults])
  }

  const handleProductSelect = (productId: number) => {
    router.push(`/products/details`)
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}`}>
        ★
      </span>
    ))
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
            <CardTitle className="text-gray-900 dark:text-white">Product Catalog</CardTitle>
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
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="w-full">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                  onClick={() => handleProductSelect(product.id)}
                >
                  <div className="aspect-square bg-gray-100 dark:bg-gray-600 rounded-t-lg overflow-hidden">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2">
                          {product.name}
                        </h3>
                        <Badge className={`${getStatusColor(product.status)} text-xs ml-2`}>{product.status}</Badge>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{product.category}</p>
                      <div className="flex items-center gap-1">
                        {renderStars(product.rating)}
                        <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-teal-600">${product.price}</span>
                        <span className="text-xs text-gray-500">{product.stock} in stock</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="cursor-pointer hover:shadow-md transition-shadow bg-white dark:bg-gray-700"
                  onClick={() => handleProductSelect(product.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-600 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{product.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{product.category}</p>
                            <div className="flex items-center gap-1 mt-1">
                              {renderStars(product.rating)}
                              <span className="text-sm text-gray-500 ml-1">({product.reviews} reviews)</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(product.status)}>{product.status}</Badge>
                            <p className="text-xl font-bold text-teal-600 mt-1">${product.price}</p>
                            <p className="text-sm text-gray-500">{product.stock} in stock</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddProductModal open={showAddModal} onOpenChange={setShowAddModal} />
    </div>
  )
}
