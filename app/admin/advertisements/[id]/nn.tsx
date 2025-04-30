import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, Phone, ImageOff } from "lucide-react"
import fetcher from "@/shared/fecher"
import { ApproveAdvertisementForm } from "../components/approve-form"

export default async function AdvertisementDetailPage({ params }: { params: { id: string } }) {
  const { id } = params

  // Fetch advertisement details
  const response = await fetcher(`/advertisements/${id}`)

  // Check if we have a valid response with data
  if (!response || !response.data) {
    notFound()
  }

  // Extract the advertisement data from the response
  const advertisement = response.data

  // Format date
  const createdAt = new Date(advertisement.created_at || Date.now()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  // Handle image URL properly
  const hasValidImage =
    advertisement.product_image &&
    typeof advertisement.product_image === "string" &&
    advertisement.product_image.trim() !== ""

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
                  {hasValidImage ? (
                    <Image
                      src={advertisement.product_image || "/placeholder.svg"}
                      alt={`${advertisement.company_name} product`}
                      width={500}
                      height={300}
                      className="w-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 h-[300px]">
                      <ImageOff className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-gray-500 dark:text-gray-400">No image available</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>

            {!advertisement.approved && (
              <CardFooter>
                <ApproveAdvertisementForm id={id} />
              </CardFooter>
            )}
          </Card>
        </div>

        <div>
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
        </div>
      </div>
    </div>
  )
}
