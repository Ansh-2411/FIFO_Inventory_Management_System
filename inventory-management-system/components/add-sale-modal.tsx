"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Product {
  product_id: number;
  name: string;
}

interface Customer {
  customer_id: number;
  name: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    products: Product[];
    customer: Customer[];
  };
}

interface AddSaleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (sale: any) => void;
}

export function AddSaleModal({ open, onOpenChange, onAdd }: AddSaleModalProps) {
  const [formData, setFormData] = useState({
    customer: "",
    product: "",
    quantity: "",
    selling_price: "",
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch products and customers when modal opens
  useEffect(() => {
    if (open) {
      fetchProductsAndCustomers();
    }
  }, [open]);

  const fetchProductsAndCustomers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3005/api/sales/products-customers');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      
      if (data.success) {
        setProducts(data.data.products);
        setCustomers(data.data.customer);
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (err) {
      console.error('Error fetching products and customers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const quantity = Number.parseInt(formData.quantity);
    const selling_price = Number.parseFloat(formData.selling_price);
    
    // Find the selected customer and product objects
    const selectedCustomer = customers.find(c => c.customer_id.toString() === formData.customer);
    const selectedProduct = products.find(p => p.product_id.toString() === formData.product);
    
    const newSale = {
      id: Date.now(),
      customer_id: selectedCustomer?.customer_id,
      customer_name: selectedCustomer?.name,
      product_id: selectedProduct?.product_id,
      product_name: selectedProduct?.name,
      quantity,
      selling_price,
      saleDate: new Date().toISOString().split("T")[0],
      total: quantity * selling_price,
    };
    onAdd(newSale);
    onOpenChange(false);
    setFormData({
      customer: "",
      product: "",
      quantity: "",
      selling_price: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Sale</DialogTitle>
          <DialogDescription>Record a new sale transaction.</DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-4">
            <p className="text-sm text-red-600 dark:text-red-400">
              Error: {error}
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchProductsAndCustomers}
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="customer">Customer</Label>
              <Select
                value={formData.customer}
                onValueChange={(value) =>
                  setFormData({ ...formData, customer: value })
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loading ? "Loading customers..." : "Select customer"} />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.customer_id} value={customer.customer_id.toString()}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="product">Product</Label>
              <Select
                value={formData.product}
                onValueChange={(value) =>
                  setFormData({ ...formData, product: value })
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loading ? "Loading products..." : "Select product"} />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.product_id} value={product.product_id.toString()}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                placeholder="Enter quantity"
                min="1"
                required
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="selling_price">Selling Price (per unit)</Label>
              <Input
                id="selling_price"
                type="number"
                step="0.01"
                value={formData.selling_price}
                onChange={(e) =>
                  setFormData({ ...formData, selling_price: e.target.value })
                }
                placeholder="Enter selling price"
                min="0"
                required
                disabled={loading}
              />
            </div>
            {formData.quantity && formData.selling_price && (
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total: $
                  {(
                    Number.parseInt(formData.quantity || "0") *
                    Number.parseFloat(formData.selling_price || "0")
                  ).toFixed(2)}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-teal-600 hover:bg-teal-700"
              disabled={loading}
            >
              {loading ? "Loading..." : "Add Sale"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
