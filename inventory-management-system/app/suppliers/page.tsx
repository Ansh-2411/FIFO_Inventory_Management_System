"use client"

import { useState } from "react"
import { Plus, Search, Filter, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AddSupplierModal } from "@/components/add-supplier-modal"

const initialSuppliers = [
  {
    id: 1,
    name: "TechCorp Ltd",
    contact: "John Anderson",
    email: "john@techcorp.com",
    phone: "+1 234-567-8901",
    address: "123 Tech Street, Silicon Valley, CA",
    totalOrders: 15,
  },
  {
    id: 2,
    name: "Coffee Roasters Inc",
    contact: "Maria Garcia",
    email: "maria@coffeeroasters.com",
    phone: "+1 234-567-8902",
    address: "456 Bean Avenue, Portland, OR",
    totalOrders: 8,
  },
  {
    id: 3,
    name: "Furniture Plus",
    contact: "David Kim",
    email: "david@furnitureplus.com",
    phone: "+1 234-567-8903",
    address: "789 Oak Road, Austin, TX",
    totalOrders: 12,
  },
  {
    id: 4,
    name: "Stationery World",
    contact: "Lisa Chen",
    email: "lisa@stationeryworld.com",
    phone: "+1 234-567-8904",
    address: "321 Paper Lane, New York, NY",
    totalOrders: 25,
  },
]

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState(initialSuppliers)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)

  const handleAddSupplier = (newSupplier: any) => {
    setSuppliers((prev) => [...prev, newSupplier])
  }

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Suppliers</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your supplier relationships</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-teal-600 hover:bg-teal-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      <Card className="bg-white dark:bg-gray-800 shadow-sm w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900 dark:text-white">Supplier Directory</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search suppliers..."
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
                  <TableHead>Supplier Name</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Total Orders</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium text-gray-900 dark:text-white">{supplier.name}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">{supplier.contact}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-3 h-3" />
                          <span className="text-gray-600 dark:text-gray-400">{supplier.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-3 h-3" />
                          <span className="text-gray-600 dark:text-gray-400">{supplier.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400 max-w-xs truncate">
                      {supplier.address}
                    </TableCell>
                    <TableCell className="font-medium">{supplier.totalOrders}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AddSupplierModal open={showAddModal} onOpenChange={setShowAddModal} onAdd={handleAddSupplier} />
    </div>
  )
}
