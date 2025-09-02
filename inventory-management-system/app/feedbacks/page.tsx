"use client";

import { useEffect, useState } from "react";
import { Search, Filter, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

// const feedback = [
//   {
//     feedback_id: 1,
//     customer_name: "John Smith",
//     product_name: "Wireless Headphones",
//     rating: 5,
//     feedback:
//       "Excellent quality and fast delivery. Very satisfied with the purchase.",
//     date: "2024-01-15",
//     status: "Published",
//   },
//   {
//     feedback_id: 2,
//     customer_name: "Sarah Johnson",
//     product_name: "Coffee Beans",
//     rating: 4,
//     feedback: "Good quality coffee, but packaging could be improved.",
//     date: "2024-01-14",
//     status: "Published",
//   },
//   {
//     feedback_id: 3,
//     customer_name: "Mike Wilson",
//     product_name: "Office Chair",
//     rating: 5,
//     feedback: "Very comfortable chair, perfect for long working hours.",
//     date: "2024-01-13",
//     status: "Published",
//   },
//   {
//     feedback_id: 4,
//     customer_name: "Emily Davis",
//     product_name: "Notebook",
//     rating: 3,
//     feedback: "Average quality, expected better paper quality for the price.",
//     date: "2024-01-12",
//     status: "Pending",
//   },
// ];

interface Feedback {
  feedback_id: number;
  rating: number;
  product_name: string;
  feedback: string;
  customer_name: string;
  feedback_datetime: string;
}

export default function FeedbackPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [error, setError] = useState<string | null>(null);
  const filteredFeedback = feedback.filter(
    (item) =>
      item.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.feedback.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch(`http://localhost:3005/api/feedbacks/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }

      const data = await response.json();
      setFeedback(data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch categories"
      );
      toast({
        title: "Error",
        description: "Failed to load categories. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Feedback
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Customer reviews and feedback
          </p>
        </div>
      </div>

      <Card className="bg-white dark:bg-gray-800 shadow-sm w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900 dark:text-white">
              Customer Reviews
            </CardTitle>
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
              <div
                key={item.feedback_id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 w-full"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {item.customer_name}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {item.product_name}
                      </Badge>
                      {/* <Badge
                        className={
                          item.status === "Published"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }
                      >
                        {item.status}
                      </Badge> */}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">{renderStars(item.rating)}</div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        ({item.rating}/5)
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {item.feedback_datetime.slice(0, 10)}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {item.feedback}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
