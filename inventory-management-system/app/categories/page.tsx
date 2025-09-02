"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Loader2 } from "lucide-react";
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
import { AddCategoryModal } from "@/components/add-category-modal";
import { EditCategoryModal } from "@/components/edit-category-modal";
import { toast } from "@/hooks/use-toast";

// Define proper TypeScript interface for Category
interface Category {
  category_id: number;
  name: string;
  description: string;
  total_products: number;
}

// const initialCategories: Category[] = [
//   {
//     id: 1,
//     name: "Electronics",
//     description: "Electronic devices and accessories",
//     total_products: 15,
//   },
//   {
//     id: 2,
//     name: "Food & Beverage",
//     description: "Food items and beverages",
//     total_products: 8,
//   },
//   {
//     id: 3,
//     name: "Furniture",
//     description: "Office and home furniture",
//     total_products: 12,
//   },
//   {
//     id: 4,
//     name: "Stationery",
//     description: "Office supplies and stationery",
//     total_products: 25,
//   },
//   {
//     id: 5,
//     name: "Clothing",
//     description: "Apparel and accessories",
//     total_products: 6,
//   },
// ];

export default function CategoriesPage() {
  // Proper state initialization with types
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3005/api/categories/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }

      const data = await response.json();
      setCategories(data.data || []);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async (
    newCategory: Omit<Category, "category_id">
  ) => {
    setIsAdding(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:3005/api/categories/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCategory),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to add category: ${response.statusText}`);
      }

      // const data = await response.json();
      const addedCategory = {
        ...newCategory,
        category_id: Date.now(),
        total_products: 0,
      };
      console.log(addedCategory);

      setCategories((prev) => [...prev, addedCategory]);
      setShowAddModal(false);

      toast({
        title: "Success",
        description: "Category added successfully!",
      });
    } catch (error) {
      console.error("Error adding category:", error);
      setError(
        error instanceof Error ? error.message : "Failed to add category"
      );
      toast({
        title: "Error",
        description: "Failed to add category. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditCategory = async (
    categoryId: number,
    updatedCategory: Omit<Category, "category_id" | "total_products">
  ) => {
    setIsEditing(true);
    setError(null);
    console.log(categoryId, updatedCategory);
    try {
      const response = await fetch(
        `http://localhost:3005/api/categories/update/${categoryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCategory),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update category: ${response.statusText}`);
      }

      const data = await response.json();
      const updatedCategoryData = data.data || {
        ...updatedCategory,
        category_id: categoryId,
      };

      setCategories((prev) =>
        prev.map((category) =>
          category.category_id === categoryId
            ? { ...category, ...updatedCategoryData }
            : category
        )
      );
      setShowEditModal(false);
      setSelectedCategory(null);

      toast({
        title: "Success",
        description: "Category updated successfully!",
      });
    } catch (error) {
      console.error("Error updating category:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update category"
      );
      toast({
        title: "Error",
        description: "Failed to update category. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEditing(false);
    }
  };

  const handleOpenEditModal = (category: Category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  const handleDeleteCategory = async (id: number) => {
    setIsDeleting(id);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:3005/api/categories/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete category: ${response.statusText}`);
      }

      setCategories((prev) =>
        prev.filter((category) => category.category_id !== id)
      );

      toast({
        title: "Success",
        description: "Category deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete category"
      );
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-gray-600 dark:text-gray-400">
            Loading categories...
          </span>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-red-600 dark:text-red-400 text-center">
          <p className="font-medium">Failed to load categories</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
        <Button onClick={fetchCategories} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Categories
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Organize your products into categories
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white"
          disabled={isAdding}
        >
          {isAdding ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Plus className="w-4 h-4 mr-2" />
          )}
          {isAdding ? "Adding..." : "Add Category"}
        </Button>
      </div>

      <Card className="bg-white dark:bg-gray-800 shadow-sm w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900 dark:text-white">
              Product Categories
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="w-full">
          <div className="w-full overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Category Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Product Count</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-gray-500"
                    >
                      {searchTerm
                        ? "No categories found matching your search."
                        : "No categories available."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category) => (
                    <TableRow key={category.category_id}>
                      <TableCell className="font-medium text-gray-900 dark:text-white">
                        {category.name}
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {category.description}
                      </TableCell>
                      <TableCell className="font-medium">
                        {category.total_products == 0
                          ? "0"
                          : category.total_products}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditModal(category)}
                            disabled={isEditing}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() =>
                              handleDeleteCategory(category.category_id)
                            }
                            disabled={isDeleting === category.category_id}
                          >
                            {isDeleting === category.category_id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AddCategoryModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onAdd={handleAddCategory}
        isLoading={isAdding}
      />

      <EditCategoryModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onEdit={handleEditCategory}
        category={selectedCategory}
        isLoading={isEditing}
      />
    </div>
  );
}
