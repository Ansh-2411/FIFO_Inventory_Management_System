"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Star, Package, DollarSign, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

// Mock product data - in a real app, this would come from an API
const mockProducts = [
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

interface ProductDetailPageProps {
  params: {
    id: string
  }
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Simulate API call
    const productId = parseInt(params.id)
    const foundProduct = mockProducts.find(p => p.id === productId)
    
    if (foundProduct) {
      setProduct(foundProduct)
    }
    setLoading(false)
  }, [params.id])

  const handleBackToProducts = () => {
    router.push('/products')
  }

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

  if (loading) {
    return (
      <div className="space-y-6 w-full">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="space-y-6 w-full">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The product you're looking for doesn't exist.</p>
          <Button onClick={handleBackToProducts} className="bg-teal-600 hover:bg-teal-700 text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={handleBackToProducts}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image: string, index: number) => (
              <div key={index} className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover cursor-pointer hover:opacity-75 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
              <Badge className={getStatusColor(product.status)}>{product.status}</Badge>
            </div>
            <p className="text-gray-600 dark:text-gray-400">{product.category}</p>
            <div className="flex items-center gap-1 mt-2">
              {renderStars(product.rating)}
              <span className="text-sm text-gray-500 ml-2">({product.reviews} reviews)</span>
            </div>
          </div>

          <div className="text-3xl font-bold text-teal-600">${product.price}</div>

          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{product.description}</p>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Package className="w-6 h-6 text-teal-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{product.stock}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">In Stock</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">${product.price}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Price</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{product.unit}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Unit</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Features</h3>
            <div className="grid grid-cols-2 gap-2">
              {product.features.map((feature: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white flex-1">
              Edit Product
            </Button>
            <Button variant="outline" className="flex-1">
              View History
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 