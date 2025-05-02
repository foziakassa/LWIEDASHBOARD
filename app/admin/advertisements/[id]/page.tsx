import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
// import { getAdvertisementById, approveAdvertisement } from "../../notification/action" // Import getAdvertisementById
import { approveAdvertisement } from "../../notification/action"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowLeft, Mail, Phone, DollarSign, Calendar } from "lucide-react"
import fetcher from "@/shared/fecher"
import { ApproveAdvertisementForm } from "../components/approval-form"

export default async function AdvertisementDetailPage({ params }: { params: { id: string } }) {
  const { id } = params

  // Fetch advertisement details
  const advertisement = await fetcher(`/advertisements/${id}`)

  if (!advertisement) {
    notFound()
    return null // or handle the notFound case appropriately
  }
  // Convert binary image data to base64 if needed
  const imageUrl = advertisement.product_image

  // Format date
  const createdAt = new Date(advertisement.created_at || Date.now()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-6">
        <Link href="/admin/advertisements" className="flex items-center text-teal-600 hover:text-teal-700">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Advertisements
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{advertisement.company_name}</CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Submitted on {createdAt}</p>
                </div>
                <Badge variant={advertisement.approved ? "success" : "outline"}>
                  {advertisement.approved ? "Approved" : "Pending"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Product Description</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {advertisement.product_description}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Product Image</h3>
                <div className="border rounded-lg overflow-hidden">
                  {/* This is a placeholder. In a real app, you'd use the actual image */}
                  <Image
                    src={advertisement.product_image || "/placeholder.svg"}
                    alt={`${advertisement.company_name} product`}
                    width={500}
                    height={300}
                    className="w-full h-72 "
                  />
                </div>
              </div>
            </CardContent>

            {/* {!advertisement.approved && (
              <CardFooter>
                <form
                  action={async () => {
                    "use server"
                    try {
                      await approveAdvertisement(id)
                      // Consider redirecting or refreshing the data after approval
                    } catch (error) {
                      console.error("Failed to approve advertisement:", error)
                      // Handle error appropriately (e.g., display an error message)
                    }
                  }}
                >
                  <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Approve Advertisement
                  </Button>
                </form>
              </CardFooter>
            )} */}

            {!advertisement.approved && (
              <CardFooter>
                <ApproveAdvertisementForm id={id} />
              </CardFooter>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-500 mr-2" />
                <a href={`mailto:${advertisement.email}`} className="text-teal-600 hover:underline">
                  {advertisement.email}
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-500 mr-2" />
                <a href={`tel:${advertisement.phone_number}`} className="text-teal-600 hover:underline">
                  {advertisement.phone_number}
                </a>
              </div>
            </CardContent>
          </Card>

          {!advertisement.approved && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="payment" className="text-sm font-medium">
                      Payment Amount
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                      </div>
                      <input
                        type="number"
                        id="payment"
                        name="payment"
                        className="pl-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="duration" className="text-sm font-medium flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Duration
                    </label>
                    <select
                      id="duration"
                      name="duration"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="1week">1 Week</option>
                      <option value="2weeks">2 Weeks</option>
                      <option value="1month">1 Month</option>
                      <option value="3months">3 Months</option>
                      <option value="6months">6 Months</option>
                      <option value="1year">1 Year</option>
                    </select>
                  </div>
                </form>
              </CardContent>
              {/* <CardFooter>
                <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">
                  Submit Payment
                </Button>
              </CardFooter> */}
              
              <CardFooter>
                <ApproveAdvertisementForm id={id} />
              </CardFooter>
           
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
