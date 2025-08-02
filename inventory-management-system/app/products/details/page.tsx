"use client"

import { useState } from "react"
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"

const productData = {
  1: {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    unit: "pcs",
    stock: 45,
    price: 99.99,
    originalPrice: 129.99,
    images: [
      "https://m.media-amazon.com/images/I/517lSvEVVsL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/6123McrMDhL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/61e9pkNmWuL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/71qT2vBIVwL._SX679_.jpg",
    ],
    status: "In Stock",
    description:
      "Premium wireless headphones with advanced noise cancellation technology and superior sound quality. These headphones are perfect for music lovers, professionals, and anyone who values high-quality audio experience. With a sleek design and comfortable fit, they're ideal for long listening sessions.",
    rating: 4.5,
    reviews: 128,
    features: [
      "Active Noise Cancellation",
      "30-hour Battery Life",
      "Bluetooth 5.0 Connectivity",
      "Quick Charge (15 min = 3 hours)",
      "Premium Materials",
      "Comfortable Ear Cushions",
    ],
    specifications: {
      "Driver Size": "40mm",
      "Frequency Response": "20Hz - 20kHz",
      Impedance: "32 Ohms",
      Weight: "250g",
      Connectivity: "Bluetooth 5.0, 3.5mm Jack",
      Battery: "30 hours playback",
    },
    reviews_data: [
      {
        id: 1,
        user: "John Smith",
        rating: 5,
        comment:
          "Excellent sound quality and comfortable to wear for long periods. The noise cancellation works perfectly!",
        date: "2024-01-15",
        verified: true,
      },
      {
        id: 2,
        user: "Sarah Johnson",
        rating: 4,
        comment: "Great headphones overall. Battery life is impressive and the build quality feels premium.",
        date: "2024-01-10",
        verified: true,
      },
      {
        id: 3,
        user: "Mike Wilson",
        rating: 5,
        comment: "Best headphones I've ever owned. Worth every penny!",
        date: "2024-01-08",
        verified: false,
      },
    ],
  },
  2: {
    id: 2,
    name: "Coffee Beans",
    category: "Food & Beverage",
    unit: "kg",
    stock: 12,
    price: 25.0,
    originalPrice: 30.0,
    images: [
      "/placeholder.svg?height=500&width=500&text=Coffee+Beans+1",
      "/placeholder.svg?height=500&width=500&text=Coffee+Beans+2",
    ],
    status: "Low Stock",
    description:
      "Premium arabica coffee beans sourced directly from the finest coffee farms around the world. These beans offer a rich, full-bodied flavor with notes of chocolate and caramel. Perfect for espresso, drip coffee, or French press brewing methods.",
    rating: 4.8,
    reviews: 89,
    features: [
      "100% Arabica Beans",
      "Single Origin",
      "Medium Roast",
      "Fair Trade Certified",
      "Freshly Roasted",
      "Vacuum Sealed",
    ],
    specifications: {
      Origin: "Colombia",
      "Roast Level": "Medium",
      Processing: "Washed",
      Altitude: "1200-1800m",
      Harvest: "2023",
      Certification: "Fair Trade, Organic",
    },
    reviews_data: [
      {
        id: 1,
        user: "Coffee Lover",
        rating: 5,
        comment: "Amazing flavor profile! These beans make the perfect morning cup.",
        date: "2024-01-12",
        verified: true,
      },
      {
        id: 2,
        user: "Barista Pro",
        rating: 5,
        comment: "Professional quality beans. Great for espresso shots.",
        date: "2024-01-09",
        verified: true,
      },
    ],
  },
  // Add more products as needed
}

interface ProductDetailPageProps {
  onBack: () => void
}

export default function ProductDetailPage({  onBack }: ProductDetailPageProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [activeTab, setActiveTab] = useState("description")
  const [productId, setProductId] = useState(1)
  const router = useRouter()

  const handleBackToProducts = () => {
    router.push('/products')
  }

  if (!productId || !productData[productId as keyof typeof productData]) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Product not found {productId} id</p>
      </div>
    )
  }

  const product = productData[productId as keyof typeof productData]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
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

  return (
    <div className="space-y-6 w-full">
      {/* Back Button */}
      <Button variant="ghost" onClick={handleBackToProducts} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </Button>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
            <img
              src={product.images[currentImageIndex] || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    index === currentImageIndex ? "border-teal-500" : "border-gray-200 dark:border-gray-600"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{product.category}</Badge>
              <Badge className={getStatusColor(product.status)}>{product.status}</Badge>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">{renderStars(product.rating)}</div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-teal-600">${product.price}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{product.stock} units available</p>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1 bg-teal-600 hover:bg-teal-700">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
            <Button variant="outline" size="icon">
              <Heart className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          <Separator />

          {/* Features */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Key Features</h3>
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex space-x-6">
            {["description", "specifications", "reviews"].map((tab) => (
              <button
                key={tab}
                className={`pb-2 border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-teal-500 text-teal-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === "description" && (
            <div className="prose max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{product.description}</p>
            </div>
          )}

          {activeTab === "specifications" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="font-medium text-gray-900 dark:text-white">{key}</span>
                  <span className="text-gray-600 dark:text-gray-400">{value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Customer Reviews</h3>
                <Button variant="outline" size="sm">
                  Write a Review
                </Button>
              </div>

              <div className="space-y-4">
                {product.reviews_data.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-900 dark:text-white">{review.user}</span>
                        {review.verified && (
                          <Badge variant="outline" className="text-xs">
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">{renderStars(review.rating)}</div>
                    <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
