"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Filter, Phone, Mail } from "lucide-react";
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
import { AddSupplierModal } from "@/components/add-supplier-modal";
import { toast } from "@/hooks/use-toast";

// const initialSuppliers = [
//   {
//     supplier_id: 1,
//     company_name: "TechCorp Ltd",
//     contact_person: "John Anderson",
//     email: "john@techcorp.com",
//     contact_number: "+1 234-567-8901",
//     address: "123 Tech Street, Silicon Valley, CA",
//     total_orders: 15,
//   },
//   {
//     supplier_id: 2,
//     company_name: "Coffee Roasters Inc",
//     contact_person: "Maria Garcia",
//     email: "maria@coffeeroasters.com",
//     contact_number: "+1 234-567-8902",
//     address: "456 Bean Avenue, Portland, OR",
//     total_orders: 8,
//   },
//   {
//     supplier_id: 3,
//     company_name: "Furniture Plus",
//     contact_person: "David Kim",
//     email: "david@furnitureplus.com",
//     contact_number: "+1 234-567-8903",
//     address: "789 Oak Road, Austin, TX",
//     total_orders: 12,
//   },
//   {
//     supplier_id: 4,
//     company_name: "Stationery World",
//     contact_person: "Lisa Chen",
//     email: "lisa@stationeryworld.com",
//     contact_number: "+1 234-567-8904",
//     address: "321 Paper Lane, New York, NY",
//     total_orders: 25,
//   },
// ];

interface Suppliers {
  supplier_id: number;
  company_name: string;
  contact_person: string;
  contact_number: string;
  address: string;
  email: string;
  total_orders: number;
}
export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Suppliers[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleAddSupplier = async (newSupplier: any) => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/suppliers/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newSupplier),
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to add supplier: ${response.statusText}`);
      }
      setSuppliers((prev) => [...prev, newSupplier]);
    } catch (error) {
      console.error("Error adding supplier:", error);
      toast({
        title: "Error",
        description: "Failed to add supplier. Please try again.",
        variant: "destructive",
      });
    }
  };
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch(`http://localhost:3005/api/suppliers/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }

      const data = await response.json();
      setSuppliers(data.data || []);
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
  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact_person
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Suppliers
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your supplier relationships
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      <Card className="bg-white dark:bg-gray-800 shadow-sm w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900 dark:text-white">
              Supplier Directory
            </CardTitle>
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
                  <TableRow key={supplier.supplier_id}>
                    <TableCell className="font-medium text-gray-900 dark:text-white">
                      {supplier.company_name}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {supplier.contact_person}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-3 h-3" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {supplier.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-3 h-3" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {supplier.contact_number}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400 max-w-xs truncate">
                      {supplier.address}
                    </TableCell>
                    <TableCell className="font-medium">
                      {supplier.total_orders}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AddSupplierModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onAdd={handleAddSupplier}
      />
    </div>
  );
}
