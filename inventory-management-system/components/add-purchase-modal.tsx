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
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Product {
  product_id: number;
  name: string;
}

interface Supplier {
  supplier_id: number;
  company_name: string;
}

interface ApiResponse {
  products: Product[];
  suppliers: Supplier[];
}

interface AddPurchaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (purchase: any) => void;
}

export function AddPurchaseModal({
  open,
  onOpenChange,
  onAdd,
}: AddPurchaseModalProps) {
  const [formData, setFormData] = useState({
    batch_no: "",
    product_id: "",
    quantity: "",
    cost_price: "",
    supplier_id: "",
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch products and suppliers when modal opens
  useEffect(() => {
    if (open) {
      fetchProductsAndSuppliers();
    }
  }, [open]);

  const fetchProductsAndSuppliers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:3005/api/purchases/products-suppliers"
      );
      const result = await response.json();

      if (result.success) {
        setProducts(result.data.products);
        setSuppliers(result.data.suppliers);
      } else {
        setError("Failed to fetch products and suppliers");
        toast({
          title: "Error",
          description:
            "Failed to fetch products and suppliers. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      setError("Error fetching products and suppliers");
      console.error("Error fetching products and suppliers:", err);
      toast({
        title: "Error",
        description: "Error fetching products and suppliers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Prepare the purchase data for API
      const purchaseData = {
        batch_no: formData.batch_no,
        product_id: parseInt(formData.product_id),
        quantity: parseInt(formData.quantity),
        cost_price: parseFloat(formData.cost_price),
        supplier_id: parseInt(formData.supplier_id),
      };

      // Get the selected product and supplier names
      const selectedProduct = products.find(
        (p) => p.product_id === Number(formData.product_id)
      );
      const selectedSupplier = suppliers.find(
        (s) => s.supplier_id === Number(formData.supplier_id)
      );

      // Create enhanced data object with names
      const enhancedData = {
        ...purchaseData,
        Product: {
          name: selectedProduct?.name || "Unknown",
        },
        Supplier: {
          name: selectedSupplier?.company_name || "Unknown",
        },
      };

      // Call the parent component's onAdd function (which will make the API call)
      onAdd(enhancedData);

      // Close modal and reset form
      onOpenChange(false);
      setFormData({
        batch_no: "",
        product_id: "",
        quantity: "",
        cost_price: "",
        supplier_id: "",
      });
    } catch (err) {
      setError("Error preparing purchase data");
      console.error("Error preparing purchase data:", err);
      toast({
        title: "Error",
        description: "Error preparing purchase data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      batch_no: "",
      product_id: "",
      quantity: "",
      cost_price: "",
      supplier_id: "",
    });
    setError(null);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Purchase</DialogTitle>
          <DialogDescription>
            Add a new purchase order to your inventory.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="batch_no">Batch Number</Label>
              <Input
                id="batch_no"
                value={formData.batch_no}
                onChange={(e) =>
                  setFormData({ ...formData, batch_no: e.target.value })
                }
                placeholder="Enter batch number"
                required
                disabled={submitting}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="product">Product</Label>
              <Select
                value={formData.product_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, product_id: value })
                }
                disabled={loading || submitting}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      loading ? "Loading products..." : "Select product"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem
                      key={product.product_id}
                      value={product.product_id.toString()}
                    >
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {loading && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading products...
                </div>
              )}
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
                disabled={submitting}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cost_price">Cost Price</Label>
              <Input
                id="cost_price"
                type="number"
                step="0.01"
                value={formData.cost_price}
                onChange={(e) =>
                  setFormData({ ...formData, cost_price: e.target.value })
                }
                placeholder="Enter cost price"
                min="0"
                required
                disabled={submitting}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Select
                value={formData.supplier_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, supplier_id: value })
                }
                disabled={loading || submitting}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      loading ? "Loading suppliers..." : "Select supplier"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem
                      key={supplier.supplier_id}
                      value={supplier.supplier_id.toString()}
                    >
                      {supplier.company_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {loading && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading suppliers...
                </div>
              )}
            </div>
            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                {error}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700"
              disabled={
                submitting ||
                !formData.batch_no ||
                !formData.product_id ||
                !formData.quantity ||
                !formData.cost_price ||
                !formData.supplier_id
              }
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Purchase"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
