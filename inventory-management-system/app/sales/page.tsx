"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, RefreshCw } from "lucide-react";
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
import { AddSaleModal } from "@/components/add-sale-modal";

interface Product {
  name: string;
}

interface Customer {
  name: string;
}

interface Sale {
  sale_id: number;
  product_id: number;
  customer_id: number;
  quantity: string;
  selling_price: string;
  sale_date: string;
  Product: Product;
  Customer: Customer;
}

interface ApiResponse {
  success: boolean;
  data: Sale[];
}

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch sales data
  const fetchSales = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3005/api/sales/all');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      
      if (data.success) {
        setSales(data.data);
      } else {
        throw new Error('Failed to fetch sales data');
      }
    } catch (err) {
      console.error('Error fetching sales:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch sales data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch sales on component mount
  useEffect(() => {
    fetchSales();
  }, []);

  const handleAddSale = async (newSale: any) => {
    try {
      const response = await fetch("http://localhost:3005/api/sales/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSale),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        console.log("New Sale Added:", newSale);
        // Refresh the sales list to get the updated data
        await fetchSales();
      } else {
        throw new Error('Failed to add sale');
      }
    } catch (error) {
      console.error("Error adding sale:", error);
      setError(error instanceof Error ? error.message : 'Failed to add sale');
    }
  };

  const filteredSales = sales.filter(
    (sale) =>
      sale.Customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.Product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotal = (quantity: string, selling_price: string) => {
    return (parseFloat(quantity) * parseFloat(selling_price)).toFixed(2);
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Sales
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your sales transactions and revenue
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={fetchSales}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white"
            disabled={loading}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Sale
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">
            Error: {error}
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchSales}
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      )}

      <Card className="bg-white dark:bg-gray-800 shadow-sm w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900 dark:text-white">
              Sales Transactions
              {loading && <span className="ml-2 text-sm text-gray-500">(Loading...)</span>}
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search sales..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                  disabled={loading}
                />
              </div>
              <Button variant="outline" size="sm" disabled={loading}>
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="w-full">
          <div className="w-full overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-500">Loading sales data...</span>
              </div>
            ) : sales.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No sales data available</p>
                <Button 
                  variant="outline" 
                  onClick={fetchSales}
                  className="mt-2"
                >
                  Refresh
                </Button>
              </div>
            ) : (
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Sale Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.map((sale) => (
                    <TableRow key={sale.sale_id}>
                      <TableCell className="font-medium text-gray-900 dark:text-white">
                        {sale.Customer.name}
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {sale.Product.name}
                      </TableCell>
                      <TableCell>{sale.quantity}</TableCell>
                      <TableCell className="font-medium">
                        ${parseFloat(sale.selling_price).toFixed(2)}
                      </TableCell>
                      <TableCell className="font-bold text-green-600">
                        ${calculateTotal(sale.quantity, sale.selling_price)}
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {formatDate(sale.sale_date)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      <AddSaleModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onAdd={handleAddSale}
      />
    </div>
  );
}
