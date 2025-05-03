"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle, DollarSign, Calendar } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

interface PaymentApprovalFormProps {
  id: string
  showCard?: boolean
}

export function PaymentApprovalForm({ id, showCard = true }: PaymentApprovalFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentDuration, setPaymentDuration] = useState("1week")
  const router = useRouter()

  const handleApprove = async () => {
    if (!paymentAmount || Number.parseFloat(paymentAmount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid payment amount",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`https://liwedoc.vercel.app/advertisements/${id}/approve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment_amount: Number.parseFloat(paymentAmount),
          payment_duration: paymentDuration,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to approve advertisement")
      }

      toast({
        title: "Success",
        description: "Advertisement has been approved with payment information",
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

  const formContent = (
    <>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="payment" className="text-sm font-medium">
            Payment Amount
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <DollarSign className="h-4 w-4 text-gray-500" />
            </div>
            <Input
              type="number"
              id="payment"
              name="payment"
              className="pl-10"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration" className="text-sm font-medium flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Duration
          </Label>
          <Select value={paymentDuration} onValueChange={setPaymentDuration}>
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1week">1 Week</SelectItem>
              <SelectItem value="2weeks">2 Weeks</SelectItem>
              <SelectItem value="1month">1 Month</SelectItem>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={handleApprove} disabled={isSubmitting} className="w-full mt-4 bg-teal-600 hover:bg-teal-700">
        <CheckCircle className="h-5 w-5 mr-2" />
        {isSubmitting ? "Processing..." : "Approve with Payment"}
      </Button>
    </>
  )

  if (!showCard) {
    return formContent
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-6">{formContent}</CardContent>
    </Card>
  )
}
