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

interface AddPurchaseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (purchase: any) => void
}

export function AddPurchaseModal({ open, onOpenChange, onAdd }: AddPurchaseModalProps) {
  const [formData, setFormData] = useState({
    batchNo: "",
    product: "",
    quantity: "",
    costPrice: "",
    supplier: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newPurchase = {
      id: Date.now(),
      batchNo: formData.batchNo,
      product: formData.product,
      quantity: Number.parseInt(formData.quantity),
      quantityRemaining: Number.parseInt(formData.quantity),
      costPrice: Number.parseFloat(formData.costPrice),
      supplier: formData.supplier,
      date: new Date().toISOString().split("T")[0],
    }
    onAdd(newPurchase)
    onOpenChange(false)
    setFormData({
      batchNo: "",
      product: "",
      quantity: "",
      costPrice: "",
      supplier: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Purchase</DialogTitle>
          <DialogDescription>Add a new purchase order to your inventory.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="batchNo">Batch Number</Label>
              <Input
                id="batchNo"
                value={formData.batchNo}
                onChange={(e) => setFormData({ ...formData, batchNo: e.target.value })}
                placeholder="Enter batch number"
                required
              />
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
              <Label htmlFor="costPrice">Cost Price</Label>
              <Input
                id="costPrice"
                type="number"
                step="0.01"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                placeholder="Enter cost price"
                min="0"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Select
                value={formData.supplier}
                onValueChange={(value) => setFormData({ ...formData, supplier: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TechCorp Ltd">TechCorp Ltd</SelectItem>
                  <SelectItem value="Coffee Roasters Inc">Coffee Roasters Inc</SelectItem>
                  <SelectItem value="Furniture Plus">Furniture Plus</SelectItem>
                  <SelectItem value="Stationery World">Stationery World</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
              Add Purchase
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
