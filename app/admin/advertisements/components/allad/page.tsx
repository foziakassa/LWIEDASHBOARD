'use client';

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Plus, ChevronRight, Pencil, Trash2, Search, Filter } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FieldAdder } from "@/components/field-adder";
import { Separator } from "@/components/ui/separator";
import axiosInstance from "@/shared/axiosinstance";
// import NewUser from "../newuser/page";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { getUserCookie } from "@/lib/cookies";

interface Advertisement {
  id: string;
  company_name?: string;
  email?: string;
  phone_number?: string;
  product_description?: string;
  created_at?: string;
  approved?: boolean;
  // Add other properties as needed to match your API response
}

export default function AdvertisementsPage() {
  const router = useRouter();
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAdvertisements, setFilteredAdvertisements] = useState<Advertisement[]>([]);
  const [approvedFilter, setApprovedFilter] = useState("all"); // "all", "true", "false"
  const [customFields, setCustomFields] = useState<any[]>([]);
  /// geting user info from cookie
      const [userRole, setUserRole] = useState<string | null>(null); // State for user role
      
        // Get user role from cookie
        useEffect(() => {
          const userData = getUserCookie(); // Get the user data object
          setUserRole(userData?.Role || null); // Access the Role property
        }, []);

  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        const response = await axiosInstance.get('/advertisements'); // Your API endpoint
        const data: Advertisement[] = response.data;

        setAdvertisements(data);
        setFilteredAdvertisements(data);
      } catch (error) {
        console.error("Failed to fetch advertisements:", error);
      }
    };

    fetchAdvertisements();
  }, []);

  useEffect(() => {
    let filtered = advertisements;

    if (searchQuery) {
      filtered = filtered.filter(
        (ad) =>
          ad.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ad.email?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (approvedFilter !== "all") {
      const approved = approvedFilter === "true";
      filtered = filtered.filter((ad) => ad.approved === approved);
    }

    setFilteredAdvertisements(filtered);
  }, [searchQuery, approvedFilter, advertisements]);

  const handleAddField = (field: any) => {
    setCustomFields((prev) => [...prev, field]);
    console.log("Added new custom field to advertisements:", field);
  };

  const handleDeleteAdvertisement = async (id: string) => {
    if (confirm("Are you sure you want to delete this advertisement?")) {
      try {
        await axiosInstance.delete(`/advertisements/${id}`); // Your API endpoint

        setAdvertisements((prevAdvertisements) => prevAdvertisements.filter((ad) => ad.id !== id));
        setFilteredAdvertisements((prevFilteredAdvertisements) =>
          prevFilteredAdvertisements.filter((ad) => ad.id !== id),
        );
        alert("Advertisement deleted successfully.");
      } catch (error) {
        console.error("Failed to delete advertisement:", error);
        alert("Failed to delete advertisement.");
      }
    }
  };

  const columns = [
    {
      accessorKey: "company_name",
      header: "Company Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone_number",
      header: "Phone Number",
    },
    {
      accessorKey: "approved",
      header: "Approved",
      cell: ({ row }) => {
        const approved = row.getValue("approved");
        let badgeClass = "";

        switch (approved) {
          case true:
            badgeClass = "bg-green-500";
            break;
          case false:
            badgeClass = "bg-red-500";
            break;
          default:
            badgeClass = "bg-gray-500";
        }

        return <Badge className={badgeClass}>{approved ? "Approved" : "Pending"}</Badge>;
      },
    },
    {
      accessorKey: "created_at",
      header: "Created At",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const advertisement = row.original;
        return (
          <div className="flex items-center gap-2">
            {userRole !== "Admin" && (
              <Button variant="ghost" size="icon" title="Edit">
              <Pencil className="h-4 w-4" />
            </Button>

            )}
            
            {userRole !== "Admin" && (
               <Button
               onClick={() => {
                 handleDeleteAdvertisement(advertisement.id);
               }}
               variant="ghost"
               size="icon"
               title="Delete"
             >
               <Trash2 className="h-4 w-4" />
             </Button>

            )}
            {userRole !== "Admin" && (
               <Button
               onClick={() => router.push(`/admin/advertisements/${advertisement.id}`)}
               variant="ghost"
               size="icon"
               title="View Details"
             >
               <ChevronRight className="h-4 w-4" />
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
        <h1 className="text-2xl font-bold">Advertisements</h1>
        <div className="flex gap-2">
         
        </div>
      </div>

      <Card>
        <div className="p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search advertisements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Button variant="outline" size="icon" title="Refresh">
                <RefreshCw className="h-4 w-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Approved: {approvedFilter === "all" ? "All" : approvedFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setApprovedFilter("all")}>All</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setApprovedFilter("true")}>Approved</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setApprovedFilter("false")}>Pending</DropdownMenuItem>
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

          <DataTable columns={columns} data={filteredAdvertisements} />
        </div>
      </Card>
    </div>
  );
}