"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Edit } from "lucide-react" // Import Edit icon
import axiosInstance from "@/shared/axiosinstance"
import { useRouter } from "next/navigation" // Import useRouter for navigation

interface Charity {
  id: string;
  name: string;
  description: string;
  location: string;
  created_at: string;
}

export default function CharityPage() {
  const router = useRouter() // Initialize router
  const [charities, setCharities] = useState<Charity[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const response = await axiosInstance.get('/charities')
        setCharities(response.data)
      } catch (error) {
        console.error("Failed to fetch charities:", error)
      }
    }
    fetchCharities()
  }, [])

  const handleDeleteCharity = async (id: string) => {
    if (confirm("Are you sure you want to delete this charity?")) {
      try {
        await axiosInstance.delete(`/charities/${id}`)
        setCharities(prev => prev.filter(charity => charity.id !== id))
        alert("Charity deleted successfully.")
      } catch (error) {
        console.error("Failed to delete charity:", error)
        alert("Failed to delete charity.")
      }
    }
  }

  const filteredCharities = charities.filter(charity =>
    charity.name.toLowerCase().includes(searchQuery.toLowerCase())
    || charity.location.toLowerCase().includes(searchQuery.toLowerCase())
    || charity.created_at.includes(searchQuery)
  )

  return (
    <div className="space-y-4 p-4 md:p-6">
      <h1 className="text-2xl font-bold">Charity Organizations</h1>
      <div className="flex items-center mb-4">
        <Input
          placeholder="Search charities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow"
        />
        <Button
          onClick={() => router.push('/admin/charity/newcharity')} // Navigate to the new charity page
          variant="ghost"
          className="ml-2 bg-white"
          title="Add Charity"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <Card>
        <div className="p-4">
          {filteredCharities.length === 0 ? (
            <p>No charities found.</p>
          ) : (
            <DataTable
              columns={[
                {
                  accessorKey: "name",
                  header: "Charity Name",
                },
                {
                  accessorKey: "description",
                  header: "Description",
                },
                {
                  accessorKey: "location",
                  header: "Location",
                },
                {
                  accessorKey: "created_at",
                  header: "Created At",
                },
                {
                  id: "actions",
                  cell: ({ row }) => (
                    <div className="flex items-center gap-4">
                      <Button
                        onClick={() => router.push(`/admin/charity/edit/${row.original.id}`)} // Navigate to edit page
                        variant="ghost"
                        size="icon"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => handleDeleteCharity(row.original.id)} variant="ghost" size="icon" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      
                    </div>
                  ),
                },
              ]}
              data={filteredCharities}
            />
          )}
        </div>
      </Card>
    </div>
  )
}