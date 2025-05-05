"use client";

import { useState, useEffect, SetStateAction } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Plus, ChevronRight, Pencil, Trash2, CheckCircle, XCircle, Filter } from "lucide-react";
import { DynamicItemForm } from "@/components/forms/dynamic-item-form";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FieldAdder } from "@/components/field-adder";
import { Separator } from "@/components/ui/separator";
import axiosInstance from "@/shared/axiosinstance";
import { getUserCookie } from "@/lib/cookies";

interface Item {
  id: string;
  userId: string;
  title: string;
  categoryId: number;
  description: string;
  condition: string;
  location: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  tradeType?: string | null;
  acceptCash: boolean;
  categoryName: string;
  images: { id: number; url: string; isMain: boolean }[];
}

interface ItemData {
  title: string;
  categoryId: number;
  description: string;
  condition: string;
  location: string;
  price: number;
}

export default function ItemsPage() {
  const [mounted, setMounted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string; icon: string }[]>([]);
  const [customFields, setCustomFields] = useState<any[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
   /// geting user info from cookie
    const [userRole, setUserRole] = useState<string | null>(null); // State for user role
    
      // Get user role from cookie
      useEffect(() => {
        const userData = getUserCookie(); // Get the user data object
        setUserRole(userData?.Role || null); // Access the Role property
      }, []);

  useEffect(() => {
    setMounted(true);
    
    // Fetch items from the API
    const fetchItems = async () => {
      try {
        const response = await axiosInstance.get('/api/items');
        ////....
        if (response.data.success) {
          const data: Item[] = response.data.items.map((item: any) => ({
            id: item.id,
            userId: item.user_id,
            title: item.title,
            categoryId: item.category_id,
            description: item.description,
            condition: item.condition,
            location: item.location,
            status: item.status,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
            tradeType: item.trade_type,
            acceptCash: item.accept_cash,
            categoryName: item.category_name,
            images: item.images.map((image: any) => ({
              id: image.id,
              url: image.url,
              isMain: image.is_main,
            })),
          }));

          setItems(data);
          setFilteredItems(data);
        }
      } catch (error) {
        console.error("Failed to fetch items:", error);
      }
    };

    // Fetch categories (add your API call here)
    const fetchCategories = async () => {
      // Assume categories are fetched from an API
      try {
        const response = await axiosInstance.get('/categories');
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchItems();
    fetchCategories();
  }, []);

  useEffect(() => {
    // Filter items based on search query, status filter, and category filter
    let filtered = items;

    // Search filtering
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        Object.values(item).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Status filtering
    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Category filtering
    if (categoryFilter !== "all") {
      filtered = filtered.filter((item) => item.categoryName === categoryFilter);
    }

    setFilteredItems(filtered);
  }, [searchQuery, statusFilter, categoryFilter, items]);

  if (!mounted) {
    return null;
  }

  const handleEditItem = (item: Item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleNewItem = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleSaveItem = (itemData: ItemData) => {
    if (editingItem) {
      // Update existing item
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                ...itemData,
                categoryName: categories.find((c) => String(c.id) === String(itemData.categoryId))?.name || "",
                categoryIcon: categories.find((c) => String(c.id) === String(itemData.categoryId))?.icon || "📦",
              }
            : item
        )
      );
    } else {
      // Add new item
      const newItem: Item = {
        ...itemData,
        id: String(items.length + 1), // Ensure unique ID
        createdAt: new Date().toISOString(), // Current date
        updatedAt: new Date().toISOString(),
        status: "Pending", // Default status
        categoryName: categories.find((c) => String(c.id) === String(itemData.categoryId))?.name || "",
        categoryIcon: categories.find((c) => String(c.id) === String(itemData.categoryId))?.icon || "📦",
        images: [], // Initialize with empty images or handle accordingly
      };
      setItems((prev) => [...prev, newItem]);
    }
    setShowForm(false); // Close the form
    setEditingItem(null); // Clear the editing state
  };

  const handleDeleteItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleApproveItem = (itemId: string) => {
    setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, status: "Approved" } : item)));
  };

  const handleRejectItem = (itemId: string) => {
    setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, status: "Rejected" } : item)));
  };

  const handleAddField = (field: any) => {
    setCustomFields((prev) => [...prev, field]);
    // Update categories with the new field if needed
    if (categoryFilter !== "all") {
      setCategories((prev) =>
        prev.map((category) =>
          category.id === categoryFilter ? { ...category, fields: [...(category.fields || []), field] } : category
        )
      );
    }
  };

  const columns = [
    {
      accessorKey: "categoryIcon",
      header: "",
      cell: ({ row }) => <span className="text-xl">{row.getValue("categoryIcon")}</span>,
    },
    {
      accessorKey: "title",
      header: "Name",
    },
    {
      accessorKey: "categoryName",
      header: "Category",
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const price = row.getValue("price");
        return price ? `$${price}` : "N/A";
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        switch (status) {
          case "Approved":
            return <Badge className="bg-green-500">Approved</Badge>;
          case "Rejected":
            return <Badge className="bg-red-500">Rejected</Badge>;
          default:
            return <Badge className="bg-yellow-500">Pending</Badge>;
        }
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-2">
            {item.status === "Pending" && (
              <>
                <Button variant="ghost" size="icon" title="Approve" onClick={() => handleApproveItem(item.id)}>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </Button>
                <Button variant="ghost" size="icon" title="Reject" onClick={() => handleRejectItem(item.id)}>
                  <XCircle className="h-4 w-4 text-red-500" />
                </Button>
              </>
            )}
            {userRole !== "Manager" &&(
              <Button variant="ghost" size="icon" title="Edit" onClick={() => handleEditItem(item)}>
              <Pencil className="h-4 w-4" />
            </Button>
           

            )}
            {userRole !== "Manager" && (
               <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDeleteItem(item.id)}>
               <Trash2 className="h-4 w-4" />
             </Button>
            )}
            
            
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Items</h1>
        <div className="flex gap-2">
          <Button onClick={handleNewItem}>
            <Plus className="mr-2 h-4 w-4" /> Add New Item
          </Button>
          {/* <FieldAdder onAddField={handleAddField} entityName="Items" /> */}
        </div>
      </div>

      {showForm ? (
        <Card className="p-6">
          <ScrollArea className="h-[calc(100vh-250px)]">
            <DynamicItemForm
              categories={categories}
              initialData={editingItem}
              onSave={handleSaveItem}
              onCancel={() => {
                setShowForm(false);
                setEditingItem(null);
              }}
            />
          </ScrollArea>
        </Card>
      ) : (
        <Card>
          <div className="p-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" title="Refresh">
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Status: {statusFilter === "all" ? "All" : statusFilter}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("Pending")}>Pending</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("Approved")}>Approved</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("Rejected")}>Rejected</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Category: {categoryFilter === "all" ? "All" : categories.find((c) => c.id === categoryFilter)?.name || categoryFilter}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setCategoryFilter("all")}>All Categories</DropdownMenuItem>
                    {categories.map((category) => (
                      <DropdownMenuItem key={category.id} onClick={() => setCategoryFilter(category.id)}>
                        <span className="mr-2">{category.icon}</span> {category.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {customFields.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">Custom Fields</Badge>
                  <span className="text-sm text-muted-foreground">
                    {customFields.length} custom {customFields.length === 1 ? "field" : "fields"} added
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {customFields.map((field, index) => (
                    <Badge key={index} variant="secondary" className="py-1">
                      {field.label} ({field.type})
                    </Badge>
                  ))}
                </div>
                <Separator className="my-4" />
              </div>
            )}

            <DataTable columns={columns} data={filteredItems} />
          </div>
        </Card>
      )}
    </div>
  );
}