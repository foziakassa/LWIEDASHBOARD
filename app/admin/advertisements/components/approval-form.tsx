"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function ApproveAdvertisementForm({ id }: { id: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleApprove = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`https://liwedoc.vercel.app/advertisements/${id}/approve`, {
        method: "PATCH",
      })

      if (!response.ok) {
        throw new Error("Failed to approve advertisement")
      }

      toast({
        title: "Success",
        description: "Advertisement has been approved",
      })

      // Refresh the page to show updated status
      router.refresh()
    } catch (error) {
      console.error("Error approving advertisement:", error)
      toast({
        title: "Error",
        description: "Failed to approve advertisement",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Button onClick={handleApprove} disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700">
      <CheckCircle className="h-5 w-5 mr-2" />
      {isSubmitting ? "Approving..." : "Approve Advertisement"}
    </Button>
  )
}
