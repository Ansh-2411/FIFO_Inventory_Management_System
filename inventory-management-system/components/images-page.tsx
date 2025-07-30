"use client"

import { useState } from "react"
import { Search, Filter, Upload, Eye, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadImagesModal } from "@/components/upload-images-modal"

const initialImages = [
  {
    id: 1,
    name: "wireless-headphones-1.jpg",
    product: "Wireless Headphones",
    size: "2.4 MB",
    uploadDate: "2024-01-15",
    url: "/placeholder.svg?height=150&width=150",
  },
  {
    id: 2,
    name: "coffee-beans-premium.jpg",
    product: "Coffee Beans",
    size: "1.8 MB",
    uploadDate: "2024-01-14",
    url: "/placeholder.svg?height=150&width=150",
  },
  {
    id: 3,
    name: "office-chair-ergonomic.jpg",
    product: "Office Chair",
    size: "3.2 MB",
    uploadDate: "2024-01-13",
    url: "/placeholder.svg?height=150&width=150",
  },
  {
    id: 4,
    name: "notebook-spiral.jpg",
    product: "Notebook",
    size: "1.5 MB",
    uploadDate: "2024-01-12",
    url: "/placeholder.svg?height=150&width=150",
  },
  {
    id: 5,
    name: "smartphone-latest.jpg",
    product: "Smartphone",
    size: "2.8 MB",
    uploadDate: "2024-01-11",
    url: "/placeholder.svg?height=150&width=150",
  },
  {
    id: 6,
    name: "laptop-gaming.jpg",
    product: "Gaming Laptop",
    size: "4.1 MB",
    uploadDate: "2024-01-10",
    url: "/placeholder.svg?height=150&width=150",
  },
]

export function ImagesPage() {
  const [images, setImages] = useState(initialImages)
  const [searchTerm, setSearchTerm] = useState("")
  const [showUploadModal, setShowUploadModal] = useState(false)

  const handleUploadImages = (newImages: any[]) => {
    setImages((prev) => [...prev, ...newImages])
  }

  const handleDeleteImage = (id: number) => {
    setImages((prev) => prev.filter((image) => image.id !== id))
  }

  const filteredImages = images.filter(
    (image) =>
      image.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.product.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Images</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage product images and media files</p>
        </div>
        <Button onClick={() => setShowUploadModal(true)} className="bg-teal-600 hover:bg-teal-700 text-white">
          <Upload className="w-4 h-4 mr-2" />
          Upload Images
        </Button>
      </div>

      <Card className="bg-white dark:bg-gray-800 shadow-sm w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900 dark:text-white">Image Gallery</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search images..."
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {filteredImages.map((image) => (
              <div key={image.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="aspect-square bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <img src={image.url || "/placeholder.svg"} alt={image.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate mb-1">{image.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{image.product}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <span>{image.size}</span>
                    <span>{image.uploadDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteImage(image.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <UploadImagesModal open={showUploadModal} onOpenChange={setShowUploadModal} onAdd={handleUploadImages} />
    </div>
  )
}
