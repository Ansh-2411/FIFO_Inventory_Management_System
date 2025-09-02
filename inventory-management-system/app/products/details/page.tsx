"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductImageUploadModal } from "@/components/product-image-upload-modal";
import { toast } from "@/hooks/use-toast";

interface Category {
  name: string;
}

interface StockQuantity {
  purchase_id: number;
  product_id: number;
  supplier_id: number;
  quantity: string;
  quantity_remaining: string;
  cost_price: string;
  purchase_date: string;
  batch_no: string;
  supplierName: string;
}

interface Feedback {
  feedback_id: number;
  rating: number;
  customer_id: number;
  product_id: number;
  feedback: string;
  feedback_datetime: string;
}

interface ProductImage {
  image_id: number;
  url: string;
  product_id: number;
}

interface Product {
  product_id: number;
  name: string;
  description: string;
  category_id: number;
  unit: string;
  created_at: string;
  Category: Category;
  stockQuantity: StockQuantity[];
  feedbackCount: number;
  averageRating: number;
  feedbacks: Feedback[];
  images: ProductImage[]; // Updated to use ProductImage interface
}

interface ApiResponse {
  success: boolean;
  data: Product;
}

export default function ProductDetailPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get product ID from URL query parameter
  const productId = searchParams.get("id");

  // Fetch product data
  const fetchProductData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:3005/api/products/${productId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      if (data.success) {
        setProduct(data.data);
        // Reset current image index if it's out of bounds
        if (data.data.images && data.data.images.length > 0) {
          setCurrentImageIndex(0);
        }
      } else {
        throw new Error("Failed to fetch product data");
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch product data"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    if (productId) {
      fetchProductData();
    }
  }, [productId]);

  const handleBackToProducts = () => {
    router.push("/products");
  };

  const nextImage = () => {
    if (product && product.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product && product.images && product.images.length > 1) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + product.images.length) % product.images.length
      );
    }
  };

  const handleImageUploaded = () => {
    // Refresh product data to get new images
    fetchProductData();
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const response = await fetch(
        `http://localhost:3005/api/images/delete/${imageId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "Image deleted successfully",
        });
        // Refresh product data to update images
        fetchProductData();
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to delete image",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the image",
        variant: "destructive",
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const getStatusColor = (stockQuantity: StockQuantity[]) => {
    const totalRemaining = stockQuantity.reduce(
      (total, item) => total + parseInt(item.quantity_remaining),
      0
    );

    if (totalRemaining === 0) {
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    } else if (totalRemaining < 10) {
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    } else {
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    }
  };

  const getStatusText = (stockQuantity: StockQuantity[]) => {
    const totalRemaining = stockQuantity.reduce(
      (total, item) => total + parseInt(item.quantity_remaining),
      0
    );

    if (totalRemaining === 0) {
      return "Out of Stock";
    } else if (totalRemaining < 10) {
      return "Low Stock";
    } else {
      return "In Stock";
    }
  };

  const calculateTotalStock = (stockQuantity: StockQuantity[]) => {
    return stockQuantity.reduce(
      (total, item) => total + parseInt(item.quantity_remaining),
      0
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6 w-full">
        <Button variant="ghost" onClick={handleBackToProducts} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-6 h-6 animate-spin text-gray-400 mr-2" />
          <span className="text-gray-500">Loading product details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 w-full">
        <Button variant="ghost" onClick={handleBackToProducts} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">
            Error: {error}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchProductData}
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-6 w-full">
        <Button variant="ghost" onClick={handleBackToProducts} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Product not found</p>
        </div>
      </div>
    );
  }

  const totalStock = calculateTotalStock(product.stockQuantity);
  const status = getStatusText(product.stockQuantity);
  const statusColor = getStatusColor(product.stockQuantity);
  const hasImages = product.images && product.images.length > 0;

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
            {hasImages ? (
              <img
                src={
                  product.images[currentImageIndex]?.url || "/placeholder.svg"
                }
                alt={product.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <p className="text-lg font-medium mb-2">No Images</p>
                  <p className="text-sm">Upload images to get started</p>
                </div>
              </div>
            )}

            {hasImages && product.images.length > 1 && (
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
          <div className="flex items-center gap-2">
            {hasImages ? (
              <div className="flex gap-2 overflow-x-auto flex-1 scrollbar-hide">
                {product.images.map((image, index) => (
                  <div key={image.image_id} className="relative flex-shrink-0">
                    <button
                      className={`w-20 h-20 rounded-lg border-2 ${
                        index === currentImageIndex
                          ? "border-teal-500"
                          : "border-gray-200 dark:border-gray-600"
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -top-0 -right-0 w-6 h-6 bg-red-500 hover:bg-red-600 text-white"
                      onClick={() => handleDeleteImage(image.image_id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : null}

            {/* Add Image Button */}
            <Button
              variant="outline"
              size="icon"
              className="w-20 h-20 flex-shrink-0 border-2 border-dashed border-gray-300 hover:border-teal-500"
              onClick={() => setShowUploadModal(true)}
            >
              <Plus className="w-6 h-6 text-gray-400" />
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{product.Category.name}</Badge>
              <Badge className={statusColor}>{status}</Badge>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {renderStars(product.averageRating)}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {product.averageRating} ({product.feedbackCount} reviews)
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-teal-600">
                Product ID: {product.product_id}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {totalStock} {product.unit} available
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Created: {formatDate(product.created_at)}
            </p>
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

          {/* Stock Information */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Stock Information
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Stock: {totalStock} {product.unit}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Purchase Batches: {product.stockQuantity.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex space-x-6">
            {["description", "stock", "reviews"].map((tab) => (
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
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {activeTab === "stock" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Stock Details</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2 px-4">Batch No.</th>
                      <th className="text-left py-2 px-4">Supplier</th>
                      <th className="text-left py-2 px-4">Quantity</th>
                      <th className="text-left py-2 px-4">Remaining</th>
                      <th className="text-left py-2 px-4">Cost Price</th>
                      <th className="text-left py-2 px-4">Purchase Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.stockQuantity.map((stock) => (
                      <tr
                        key={stock.purchase_id}
                        className="border-b border-gray-200 dark:border-gray-700"
                      >
                        <td className="py-2 px-4 font-mono text-sm">
                          {stock.batch_no}
                        </td>
                        <td className="py-2 px-4">{stock.supplierName}</td>
                        <td className="py-2 px-4">
                          {stock.quantity} {product.unit}
                        </td>
                        <td className="py-2 px-4">
                          {stock.quantity_remaining} {product.unit}
                        </td>
                        <td className="py-2 px-4">
                          ${parseFloat(stock.cost_price).toFixed(2)}
                        </td>
                        <td className="py-2 px-4">
                          {formatDate(stock.purchase_date)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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

              {product.feedbacks.length === 0 ? (
                <p className="text-gray-500">
                  No reviews yet. Be the first to review this product!
                </p>
              ) : (
                <div className="space-y-4">
                  {product.feedbacks.map((feedback) => (
                    <div
                      key={feedback.feedback_id}
                      className="border-b border-gray-200 dark:border-gray-700 pb-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gray-900 dark:text-white">
                            Customer #{feedback.customer_id}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(feedback.feedback_datetime)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        {renderStars(feedback.rating)}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        {feedback.feedback}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Upload Modal */}
      <ProductImageUploadModal
        open={showUploadModal}
        onOpenChange={setShowUploadModal}
        productId={productId || ""}
        onImageUploaded={handleImageUploaded}
      />
    </div>
  );
}
