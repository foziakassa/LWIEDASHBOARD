"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Search, Eye, Calendar, Loader2, RefreshCw, DollarSign, Phone, Mail } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import type { PostItem } from "@/app/types"
import { getAllItems, deleteItem } from "@/lib/api"
import { DeleteDialog } from "@/components/delete-dialog"
import { ItemDetailDialog } from "@/components/item-detail-dialog"

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<PostItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItem, setSelectedItem] = useState<PostItem | undefined>()
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; post?: PostItem; isLoading: boolean }>({
    isOpen: false,
    isLoading: false,
  })

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.subcategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const data = await getAllItems()
      setPosts(data)

      if (data.length === 0) {
        toast({
          title: "No Data",
          description: "No posts found.",
          variant: "default",
        })
      } else {
        toast({
          title: "Success",
          description: `Loaded ${data.length} posts successfully.`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch posts. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async () => {
    if (!deleteDialog.post) return

    try {
      setDeleteDialog((prev) => ({ ...prev, isLoading: true }))

      const success = await deleteItem(deleteDialog.post.id)

      if (success) {
        // Remove from local state only if deletion was successful
        setPosts(posts.filter((post) => post.id !== deleteDialog.post!.id))

        toast({
          title: "Success",
          description: "Post deleted successfully from database.",
        })
      }

      setDeleteDialog({ isOpen: false, isLoading: false })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post from database. Please check if the delete endpoint exists.",
        variant: "destructive",
      })
      setDeleteDialog((prev) => ({ ...prev, isLoading: false }))
    }
  }

  const handleViewDetails = (item: PostItem) => {
    setSelectedItem(item)
    setIsDetailOpen(true)
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      draft: "outline",
      published: "default",
      active: "default",
      inactive: "secondary",
      swapped: "secondary",
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
    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading posts...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button onClick={fetchPosts} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Card>
        {/* <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Posts ({posts.length})</CardTitle>
          </div>
        </CardHeader> */}
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts by title, category, location, or email..."
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
                      <TableHead className="min-w-[250px]">Post Details</TableHead>
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
                    {filteredPosts.length === 0 ? (
                      <TableRow>
                        <td colSpan={9} className="text-center py-8 text-muted-foreground border-b">
                          {searchTerm
                            ? "No posts found matching your search."
                            : posts.length === 0
                              ? "No posts available."
                              : "No posts match the current filter."}
                        </td>
                      </TableRow>
                    ) : (
                      filteredPosts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell className="font-medium">
                            <div className="max-w-[240px]">
                              <p className="font-medium truncate">{post.title}</p>
                              <p className="text-sm text-muted-foreground line-clamp-2">{post.description}</p>
                              <p className="text-xs text-muted-foreground">ID: {post.id}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Badge variant="outline" className="text-xs">
                                {post.category}
                              </Badge>
                              <p className="text-xs text-muted-foreground">{post.subcategory}</p>
                            </div>
                          </TableCell>
                          <TableCell>{getConditionBadge(post.condition)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm font-medium">{formatPrice(post.price)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">{post.city}</p>
                              <p className="text-xs text-muted-foreground">{post.subcity}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-1">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs truncate max-w-[120px]">{post.email}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Phone className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs">{post.phone}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(post.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{new Date(post.createdat).toLocaleDateString()}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button variant="outline" size="sm" onClick={() => handleViewDetails(post)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDeleteDialog({ isOpen: true, post, isLoading: false })}
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
        onConfirm={handleDeletePost}
        title="Delete Post"
        description={`Are you sure you want to delete "${deleteDialog.post?.title}"? This will permanently remove it from the database.`}
        isLoading={deleteDialog.isLoading}
      />

      <ItemDetailDialog
        item={selectedItem}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false)
          setSelectedItem(undefined)
        }}
      />
    </div>
  )
}
