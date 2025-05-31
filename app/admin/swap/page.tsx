"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Search, Eye, Calendar, Loader2, RefreshCw, DollarSign, Phone, Mail } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import type { SwapItem } from "@/app/types"
import { getAllSwaps, deleteSwap } from "@/lib/api"
import { DeleteDialog } from "@/components/delete-dialog"
import { SwapDetailDialog } from "@/components/swap-detail-dialog"

export default function AdminSwapsPage() {
  const [swaps, setSwaps] = useState<SwapItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSwap, setSelectedSwap] = useState<SwapItem | undefined>()
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; swap?: SwapItem; isLoading: boolean }>({
    isOpen: false,
    isLoading: false,
  })

  const filteredSwaps = swaps.filter(
    (swap) =>
      swap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      swap.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      swap.subcategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      swap.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      swap.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      swap.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const fetchSwaps = async () => {
    try {
      setLoading(true)
      const data = await getAllSwaps()
      setSwaps(data)

      if (data.length === 0) {
        toast({
          title: "No Data",
          description: "No swaps found.",
          variant: "default",
        })
      } else {
        toast({
          title: "Success",
          description: `Loaded ${data.length} swaps successfully.`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch swaps. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSwap = async () => {
    if (!deleteDialog.swap) return

    try {
      setDeleteDialog((prev) => ({ ...prev, isLoading: true }))

      const success = await deleteSwap(deleteDialog.swap.id)

      if (success) {
        // Remove from local state only if deletion was successful
        setSwaps(swaps.filter((swap) => swap.id !== deleteDialog.swap!.id))

        toast({
          title: "Success",
          description: "Swap deleted successfully from database.",
        })
      }

      setDeleteDialog({ isOpen: false, isLoading: false })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete swap from database. Please check if the delete endpoint exists.",
        variant: "destructive",
      })
      setDeleteDialog((prev) => ({ ...prev, isLoading: false }))
    }
  }

  const handleViewDetails = (swap: SwapItem) => {
    setSelectedSwap(swap)
    setIsDetailOpen(true)
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      swapped: "default",
      pending: "outline",
      active: "secondary",
      completed: "default",
      cancelled: "destructive",
    }

    return <Badge variant={variants[status.toLowerCase()] || "outline"}>{status}</Badge>
  }

  const getConditionBadge = (condition: string) => {
    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      new: "default",
      used: "secondary",
      refurbished: "outline",
      "like new": "secondary",
      poor: "destructive",
    }

    return <Badge variant={variants[condition.toLowerCase()] || "outline"}>{condition}</Badge>
  }

  const formatPrice = (price: string) => {
    try {
      const numPrice = Number.parseFloat(price)
      if (isNaN(numPrice)) return price
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(numPrice)
    } catch {
      return price
    }
  }

  useEffect(() => {
    fetchSwaps()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading swaps...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button onClick={fetchSwaps} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Card>
        {/* <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Swaps ({swaps.length})</CardTitle>
          </div>
        </CardHeader> */}
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search swaps by title, category, location, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="w-full">
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[250px]">Item Details</TableHead>
                      <TableHead className="min-w-[120px]">Category</TableHead>
                      <TableHead className="min-w-[100px]">Condition</TableHead>
                      <TableHead className="min-w-[100px]">Price</TableHead>
                      <TableHead className="min-w-[150px]">Location</TableHead>
                      <TableHead className="min-w-[180px]">Contact</TableHead>
                      <TableHead className="min-w-[80px]">Status</TableHead>
                      <TableHead className="min-w-[100px]">Created</TableHead>
                      <TableHead className="min-w-[120px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSwaps.length === 0 ? (
                      <TableRow>
                        <td colSpan={9} className="text-center py-8 text-muted-foreground border-b">
                          {searchTerm
                            ? "No swaps found matching your search."
                            : swaps.length === 0
                              ? "No swaps available."
                              : "No swaps match the current filter."}
                        </td>
                      </TableRow>
                    ) : (
                      filteredSwaps.map((swap) => (
                        <TableRow key={swap.id}>
                          <TableCell className="font-medium">
                            <div className="max-w-[240px]">
                              <p className="font-medium truncate">{swap.title}</p>
                              <p className="text-sm text-muted-foreground line-clamp-2">{swap.description}</p>
                              <p className="text-xs text-muted-foreground">ID: {swap.id}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Badge variant="outline" className="text-xs">
                                {swap.category}
                              </Badge>
                              <p className="text-xs text-muted-foreground">{swap.subcategory}</p>
                            </div>
                          </TableCell>
                          <TableCell>{getConditionBadge(swap.condition)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm font-medium">{formatPrice(swap.price)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">{swap.city}</p>
                              <p className="text-xs text-muted-foreground">{swap.subcity}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-1">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs truncate max-w-[120px]">{swap.email}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Phone className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs">{swap.phone}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(swap.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{new Date(swap.createdat).toLocaleDateString()}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button variant="outline" size="sm" onClick={() => handleViewDetails(swap)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDeleteDialog({ isOpen: true, swap, isLoading: false })}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <DeleteDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, isLoading: false })}
        onConfirm={handleDeleteSwap}
        title="Delete Swap"
        description={`Are you sure you want to delete "${deleteDialog.swap?.title}"? This will permanently remove it from the database.`}
        isLoading={deleteDialog.isLoading}
      />

      <SwapDetailDialog
        swap={selectedSwap}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false)
          setSelectedSwap(undefined)
        }}
      />
    </div>
  )
}
