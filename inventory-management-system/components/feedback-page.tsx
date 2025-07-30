"use client"

import { useState } from "react"
import { Search, Filter, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const feedback = [
  {
    id: 1,
    customer: "John Smith",
    product: "Wireless Headphones",
    rating: 5,
    comment: "Excellent quality and fast delivery. Very satisfied with the purchase.",
    date: "2024-01-15",
    status: "Published",
  },
  {
    id: 2,
    customer: "Sarah Johnson",
    product: "Coffee Beans",
    rating: 4,
    comment: "Good quality coffee, but packaging could be improved.",
    date: "2024-01-14",
    status: "Published",
  },
  {
    id: 3,
    customer: "Mike Wilson",
    product: "Office Chair",
    rating: 5,
    comment: "Very comfortable chair, perfect for long working hours.",
    date: "2024-01-13",
    status: "Published",
  },
  {
    id: 4,
    customer: "Emily Davis",
    product: "Notebook",
    rating: 3,
    comment: "Average quality, expected better paper quality for the price.",
    date: "2024-01-12",
    status: "Pending",
  },
]

export function FeedbackPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredFeedback = feedback.filter(
    (item) =>
      item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.comment.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Feedback</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Customer reviews and feedback</p>
        </div>
      </div>

      <Card className="bg-white dark:bg-gray-800 shadow-sm w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900 dark:text-white">Customer Reviews</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search feedback..."
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
            {filteredFeedback.map((item) => (
              <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 w-full">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">{item.customer}</h3>
                      <Badge variant="outline" className="text-xs">
                        {item.product}
                      </Badge>
                      <Badge
                        className={
                          item.status === "Published"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">{renderStars(item.rating)}</div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">({item.rating}/5)</span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{item.date}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{item.comment}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
