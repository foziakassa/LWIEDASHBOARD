import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, Phone } from "lucide-react"
import fetcher from "@/shared/fecher"
// import { PaymentApprovalForm } from "../components/payment-approval-form"
import { PaymentApprovalForm } from "../components/approval-form"

export default async function AdvertisementDetailPage({ params }: { params: { id: string } }) {
  const { id } = params

  // Fetch advertisement details
  const advertisement = await fetcher(`/advertisements/${id}`)

  if (!advertisement) {
    notFound()
    return null
  }

  // Format date
  const createdAt = new Date(advertisement.created_at || Date.now()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  // Format expiration date if it exists
  const expirationDate = advertisement.expiration_date
    ? new Date(advertisement.expiration_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

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
                  {expirationDate && (
                    <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">Expires on {expirationDate}</p>
                  )}
                </div>
                <Badge variant={advertisement.approved ? "default" : "secondary"}>
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
                  <Image
                    src={advertisement.product_image || "/placeholder.svg"}
                    alt={`${advertisement.company_name} product`}
                    width={500}
                    height={300}
                    className="w-full h-72"
                  />
                </div>
              </div>

              {/* {advertisement.approved && advertisement.payment_amount && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Payment Information</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm font-medium">Amount:</p>
                      <p>${advertisement.payment_amount}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Duration:</p>
                      <p>{advertisement.payment_duration}</p>
                    </div>
                  </div>
                </div>
              )} */}
            </CardContent>

            {/* {!advertisement.approved && (
              <CardFooter>
                <PaymentApprovalForm id={id} />
              </CardFooter>
            )} */}
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
                <PaymentApprovalForm id={id} showCard={false} />
              </CardContent>
            </Card>
          )}
           {advertisement.approved && advertisement.payment_amount && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
              <div className="">
               <p className="text-sm font-medium">Amount:</p>
                      <p>${advertisement.payment_amount}</p>
                      </div>
                      <div>
                      <p className="text-sm font-medium">Duration:</p>
                      <p>{advertisement.payment_duration}</p>
                    </div>
                    <div className="text-sm font-medium">
                      <p className="text-sm font-medium">Expaire Date :</p>
                      <p className="text-red-900">{expirationDate}</p>
                    </div>
              </CardContent>
              
            </Card>
              )}
          
        </div>
      </div>
    </div>
  )
}
