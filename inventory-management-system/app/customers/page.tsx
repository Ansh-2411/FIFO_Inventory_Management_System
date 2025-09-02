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
import { AddCustomerModal } from "@/components/add-customer-modal";

// const initialCustomers = [
//   {
//     id: 1,
//     name: "John Smith",
//     email: "john.smith@email.com",
//     phone: "+1 234-567-8901",
//     address: "123 Main Street, Anytown, USA",
//     totalPurchases: 5,
//     totalSpent: 1250.0,
//   },
//   {
//     id: 2,
//     name: "Sarah Johnson",
//     email: "sarah.j@email.com",
//     phone: "+1 234-567-8902",
//     address: "456 Oak Avenue, Somewhere, USA",
//     totalPurchases: 3,
//     totalSpent: 875.5,
//   },
//   {
//     id: 3,
//     name: "Mike Wilson",
//     email: "mike.wilson@email.com",
//     phone: "+1 234-567-8903",
//     address: "789 Pine Road, Elsewhere, USA",
//     totalPurchases: 8,
//     totalSpent: 2100.75,
//   },
//   {
//     id: 4,
//     name: "Emily Davis",
//     email: "emily.davis@email.com",
//     phone: "+1 234-567-8904",
//     address: "321 Elm Street, Nowhere, USA",
//     totalPurchases: 2,
//     totalSpent: 450.25,
//   },
// ];

interface Customer {
  customer_id: number;
  name: string;
  email: string;
  contact: string;
  address: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddCustomer = async (newCustomer: any) => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/customers/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCustomer),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setCustomers((prev) => [...prev, newCustomer]);
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`http://localhost:3005/api/customers/all`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setCustomers(data.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Customers
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your customer relationships
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <Card className="bg-white dark:bg-gray-800 shadow-sm w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900 dark:text-white">
              Customer Directory
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search customers..."
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
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Address</TableHead>
                  {/* <TableHead>Total Purchases</TableHead>
                  <TableHead>Total Spent</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.customer_id}>
                    <TableCell className="font-medium text-gray-900 dark:text-white">
                      {customer.name}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-3 h-3" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {customer.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-3 h-3" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {customer.contact}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400 max-w-xs truncate">
                      {customer.address}
                    </TableCell>
                    {/* <TableCell className="font-medium">{customer.totalPurchases}</TableCell>
                    <TableCell className="font-medium text-green-600">${customer.totalSpent.toFixed(2)}</TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AddCustomerModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onAdd={handleAddCustomer}
      />
    </div>
  );
}
