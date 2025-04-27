"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation" // Import useParams
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axiosInstance from "@/shared/axiosinstance"

interface Charity {
  id: string;
  name: string;
  description: string;
  location: string;
}

export default function EditCharityPage() {
  const router = useRouter()
  const { id } = useParams() // Use useParams to get the id
  const [charity, setCharity] = useState<Charity | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCharity = async () => {
      if (id) {
        try {
          const response = await axiosInstance.get(`/charities/${id}`)
          setCharity(response.data)
        } catch (error) {
          console.error("Failed to fetch charity:", error)
        } finally {
          setLoading(false)
        }
      }
    }
    fetchCharity()
  }, [id])

  const handleUpdateCharity = async () => {
    if (charity) {
      try {
        await axiosInstance.put(`/charities/${charity.id}`, {
          id: charity.id,
          name: charity.name,
          description: charity.description,
          location: charity.location,
        })
        alert("Charity updated successfully.")
        router.push('/admin/charity') // Navigate back to the charity list
      } catch (error) {
        console.error("Failed to update charity:", error)
        alert("Failed to update charity.")
      }
    }
  }

  if (loading) return <p>Loading...</p>

  return (
    <Card className="p-4">
      <h2 className="text-xl font-bold">Edit Charity</h2>
      <Input
        placeholder="Charity Name"
        value={charity?.name || ""}
        onChange={(e) => setCharity((prev) => prev ? { ...prev, name: e.target.value } : { id: "", name: e.target.value, description: "", location: "" })}
        className="mt-2 mb-4"
      />
      <Input
        placeholder="Description"
        value={charity?.description || ""}
        onChange={(e) => setCharity((prev) => prev ? { ...prev, description: e.target.value } : { id: "", name: "", description: e.target.value, location: "" })}
        className="mt-2 mb-4"
      />
      <Input
        placeholder="Location"
        value={charity?.location || ""}
        onChange={(e) => setCharity((prev) => prev ? { ...prev, location: e.target.value } : { id: "", name: "", description: "", location: e.target.value })}
        className="mt-2 mb-4"
      />
      ////
      <div className="flex justify-between">
        <Button onClick={handleUpdateCharity} variant="default">Save</Button>
        <Button onClick={() => router.push('/admin/charity')} variant="outline">Cancel</Button>
      </div>
    </Card>
  )
}