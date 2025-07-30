"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddSaleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (sale: any) => void
}

export function AddSaleModal({ open, onOpenChange, onAdd }: AddSaleModalProps) {
  const [formData, setFormData] = useState({
    customer: "",
    product: "",
    quantity: "",
    sellingPrice: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const quantity = Number.parseInt(formData.quantity)
    const sellingPrice = Number.parseFloat(formData.sellingPrice)
    const newSale = {
      id: Date.now(),
      customer: formData.customer,
      product: formData.product,
      quantity,
      sellingPrice,
      saleDate: new Date().toISOString().split("T")[0],
      total: quantity * sellingPrice,
    }
    onAdd(newSale)
    onOpenChange(false)
    setFormData({
      customer: "",
      product: "",
      quantity: "",
      sellingPrice: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Sale</DialogTitle>
          <DialogDescription>Record a new sale transaction.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="customer">Customer</Label>
              <Select
                value={formData.customer}
                onValueChange={(value) => setFormData({ ...formData, customer: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="John Smith">John Smith</SelectItem>
                  <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                  <SelectItem value="Mike Wilson">Mike Wilson</SelectItem>
                  <SelectItem value="Emily Davis">Emily Davis</SelectItem>
                  <SelectItem value="Robert Brown">Robert Brown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="product">Product</Label>
              <Select value={formData.product} onValueChange={(value) => setFormData({ ...formData, product: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Wireless Headphones">Wireless Headphones</SelectItem>
                  <SelectItem value="Coffee Beans">Coffee Beans</SelectItem>
                  <SelectItem value="Office Chair">Office Chair</SelectItem>
                  <SelectItem value="Notebook">Notebook</SelectItem>
                  <SelectItem value="Smartphone">Smartphone</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="Enter quantity"
                min="1"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sellingPrice">Selling Price (per unit)</Label>
              <Input
                id="sellingPrice"
                type="number"
                step="0.01"
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                placeholder="Enter selling price"
                min="0"
                required
              />
            </div>
            {formData.quantity && formData.sellingPrice && (
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total: $
                  {(
                    Number.parseInt(formData.quantity || "0") * Number.parseFloat(formData.sellingPrice || "0")
                  ).toFixed(2)}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
              Add Sale
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
