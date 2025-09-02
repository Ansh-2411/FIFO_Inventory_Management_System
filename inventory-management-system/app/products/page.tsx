"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddProductModal } from "@/components/add-product-modal";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

// API data interface
interface ApiProduct {
  product_id: number;
  name: string;
  description: string;
  category_id: number;
  unit: string;
  created_at: string;
  Category: {
    name: string;
  };
  feedbackCount: number;
  averageRating: number;
  stockQuantity: number;
}

// UI Product interface (for display)
interface Product {
  id: number;
  name: string;
  category: string;
  unit: string;
  stock: number;
  price: number;
  image: string;
  images: string[];
  status: string;
  description: string;
  rating: number;
  reviews: number;
  features: string[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [apiProducts, setApiProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const router = useRouter();

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Replace with your actual API endpoint
        const response = await fetch("http://localhost:3005/api/products/all");
        const result = await response.json();

        if (result.success) {
          setApiProducts(result.data);
          // Transform API data to UI format
          const transformedProducts = result.data.map(
            (apiProduct: ApiProduct) => ({
              id: apiProduct.product_id,
              name: apiProduct.name,
              category: apiProduct.Category.name,
              unit: apiProduct.unit,
              stock: apiProduct.stockQuantity,
              price: 0, // You might want to add price to your API response
              image: "/placeholder.svg?height=200&width=200",
              images: ["/placeholder.svg?height=400&width=400"],
              status:
                apiProduct.stockQuantity > 10
                  ? "In Stock"
                  : apiProduct.stockQuantity > 0
                  ? "Low Stock"
                  : "Out of Stock",
              description: apiProduct.description,
              rating: apiProduct.averageRating,
              reviews: apiProduct.feedbackCount,
              features: [], // You might want to add features to your API response
            })
          );
          setProducts(transformedProducts);

          // Show success toast if products were loaded
          if (transformedProducts.length > 0) {
            toast({
              title: "Success",
              description: `${transformedProducts.length} products loaded successfully!`,
            });
          }
        } else {
          setError("Failed to fetch products");
          toast({
            title: "Error",
            description: "Failed to fetch products. Please try again.",
            variant: "destructive",
          });
        }
      } catch (err) {
        setError("Error fetching products");
        console.error("Error fetching products:", err);
        toast({
          title: "Error",
          description: "Error fetching products. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = (newProduct: any) => {
    // Transform the new product to match our UI format
    const transformedProduct = {
      id: newProduct.product_id,
      name: newProduct.name,
      category: newProduct.Category?.name || "Unknown",
      unit: newProduct.unit,
      stock: newProduct.stockQuantity || 0,
      price: 0, // You might want to add price to your API response
      image: "/placeholder.svg?height=200&width=200",
      images: ["/placeholder.svg?height=400&width=400"],
      status:
        (newProduct.stockQuantity || 0) > 10
          ? "In Stock"
          : (newProduct.stockQuantity || 0) > 0
          ? "Low Stock"
          : "Out of Stock",
      description: newProduct.description,
      rating: newProduct.averageRating || 0,
      reviews: newProduct.feedbackCount || 0,
      features: [],
    };

    // Add to both API products and UI products
    setApiProducts((prev) => [...prev, newProduct]);
    setProducts((prev) => [...prev, transformedProduct]);
  };

  const handleProductSelect = (productId: number) => {
    router.push(`/products/details?id=${productId}`);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Out of Stock":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${
          i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="space-y-6 w-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Products
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your product inventory
            </p>
          </div>
        </div>
        <Card className="bg-white dark:bg-gray-800 shadow-sm w-full">
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Loading products...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 w-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Products
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your product inventory
            </p>
          </div>
        </div>
        <Card className="bg-white dark:bg-gray-800 shadow-sm w-full">
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <p className="text-red-600 dark:text-red-400">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  className="mt-2 bg-teal-600 hover:bg-teal-700 text-white"
                >
                  Retry
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Products
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your product inventory
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Card className="bg-white dark:bg-gray-800 shadow-sm w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900 dark:text-white">
              Product Catalog
            </CardTitle>
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
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm
                  ? "No products found matching your search."
                  : "No products available."}
              </p>
            </div>
          ) : viewMode === "grid" ? (
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
                        <Badge
                          className={`${getStatusColor(
                            product.status
                          )} text-xs ml-2`}
                        >
                          {product.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {product.category}
                      </p>
                      <div className="flex items-center gap-1">
                        {renderStars(product.rating)}
                        <span className="text-xs text-gray-500 ml-1">
                          ({product.reviews})
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        {/* <span className="text-lg font-bold text-teal-600">
                          ${product.price}
                        </span> */}
                        <span className="text-xs text-gray-500">
                          {product.stock} in stock
                        </span>
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
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {product.category}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              {renderStars(product.rating)}
                              <span className="text-sm text-gray-500 ml-1">
                                ({product.reviews} reviews)
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(product.status)}>
                              {product.status}
                            </Badge>
                            {/* <p className="text-xl font-bold text-teal-600 mt-1">${product.price}</p> */}
                            <p className="text-sm text-gray-500">
                              {product.stock} in stock
                            </p>
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

      <AddProductModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onAddProduct={handleAddProduct}
      />
    </div>
  );
}
