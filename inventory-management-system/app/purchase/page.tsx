"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AddPurchaseModal } from "@/components/add-purchase-modal";
import { toast } from "@/hooks/use-toast";

// API data interface
interface ApiPurchase {
  purchase_id: number;
  product_id: number;
  supplier_id: number;
  quantity: string;
  quantity_remaining: string;
  cost_price: string;
  purchase_date: string;
  batch_no: string;
  Product: {
    name: string;
  };
  Supplier: {
    company_name: string;
  };
}

// UI Purchase interface (for display)
interface Purchase {
  id: number;
  batchNo: string;
  product: string;
  quantity: number;
  quantityRemaining: number;
  costPrice: number;
  supplier: string;
  date: string;
}

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [apiPurchases, setApiPurchases] = useState<ApiPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch purchases from API
  useEffect(() => {
    fetchPurchases();
  }, []);

  async function fetchPurchases() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:3005/api/purchases/all");
      const result = await response.json();

      if (result.success) {
        setApiPurchases(result.data);
        // Transform API data to UI format
        const transformedPurchases = result.data.map(
          (apiPurchase: ApiPurchase) => ({
            id: apiPurchase.purchase_id,
            batchNo: apiPurchase.batch_no,
            product: apiPurchase.Product?.name || "Unknown",
            quantity: parseInt(apiPurchase.quantity),
            quantityRemaining: parseInt(apiPurchase.quantity_remaining),
            costPrice: parseFloat(apiPurchase.cost_price),
            supplier: apiPurchase.Supplier?.company_name || "Unknown",
            date: new Date(apiPurchase.purchase_date).toLocaleDateString(),
          })
        );
        setPurchases(transformedPurchases);

        // Show success toast if purchases were loaded
        if (transformedPurchases.length > 0) {
          toast({
            title: "Success",
            description: `${transformedPurchases.length} purchases loaded successfully!`,
          });
        }
      } else {
        setError("Failed to fetch purchases");
        toast({
          title: "Error",
          description: "Failed to fetch purchases. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      setError("Error fetching purchases");
      console.error("Error fetching purchases:", err);
      toast({
        title: "Error",
        description: "Error fetching purchases. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleAddPurchase = async (newPurchase: any) => {
    try {
      const response = await fetch(
        "http://localhost:3005/api/purchases/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPurchase),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to add purchase: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        // Instead of manually adding to state, refresh the data from API
        // This ensures we get the latest data and prevents duplicates
        await fetchPurchases();

        toast({
          title: "Success",
          description: "Purchase added successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add purchase. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding purchase:", error);
      toast({
        title: "Error",
        description: "Error adding purchase. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredPurchases = purchases.filter(
    (purchase) =>
      purchase.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.batchNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6 w-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Purchases
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Track your purchase orders and inventory batches
            </p>
          </div>
        </div>
        <Card className="bg-white dark:bg-gray-800 shadow-sm w-full">
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Loading purchases...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && purchases.length === 0) {
    return (
      <div className="space-y-6 w-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Purchases
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Track your purchase orders and inventory batches
            </p>
          </div>
        </div>
        <Card className="bg-white dark:bg-gray-800 shadow-sm w-full">
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <p className="text-red-600 dark:text-red-400">{error}</p>
                <Button
                  onClick={fetchPurchases}
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
            Purchases
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your purchase orders and inventory batches
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Purchase
        </Button>
      </div>

      <Card className="bg-white dark:bg-gray-800 shadow-sm w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900 dark:text-white">
              Purchase Orders
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search purchases..."
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
                  <TableHead>Batch No.</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead>Cost Price</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPurchases.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-gray-500"
                    >
                      {searchTerm
                        ? "No purchases found matching your search."
                        : "No purchases available."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPurchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell className="font-mono text-sm">
                        {purchase.batchNo}
                      </TableCell>
                      <TableCell className="font-medium text-gray-900 dark:text-white">
                        {purchase.product}
                      </TableCell>
                      <TableCell>{purchase.quantity}</TableCell>
                      <TableCell>
                        <span
                          className={
                            purchase.quantityRemaining === 0
                              ? "text-red-600"
                              : "text-gray-900 dark:text-white"
                          }
                        >
                          {purchase.quantityRemaining}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">
                        ${purchase.costPrice.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {purchase.supplier}
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {purchase.date}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            purchase.quantityRemaining === 0
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              : purchase.quantityRemaining <
                                purchase.quantity * 0.2
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          }
                        >
                          {purchase.quantityRemaining === 0
                            ? "Depleted"
                            : purchase.quantityRemaining <
                              purchase.quantity * 0.2
                            ? "Low"
                            : "Available"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AddPurchaseModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onAdd={handleAddPurchase}
      />
    </div>
  );
}
