// import Link from "next/link"
// import Image from "next/image"
// import { Card, CardContent, CardFooter } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Calendar, Clock } from "lucide-react"

// interface Advertisement {
//   id: string
//   company_name: string
//   product_description: string
//   product_image: string
//   approved: boolean
//   created_at: string
//   expiration_date: string | null
//   payment_amount: number | null
//   payment_duration: string | null
// }

// export function AdvertisementCard({ advertisement }: { advertisement: Advertisement }) {
//   // Format dates
//   const createdAt = new Date(advertisement.created_at).toLocaleDateString()

//   // Calculate days remaining if there's an expiration date
//   let daysRemaining = null
//   if (advertisement.expiration_date) {
//     const today = new Date()
//     const expDate = new Date(advertisement.expiration_date)
//     const diffTime = expDate.getTime() - today.getTime()
//     daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
//   }

//   return (
//     <Card className="overflow-hidden">
//       <div className="relative h-48">
//         <Image
//           src={advertisement.product_image || "/placeholder.svg"}
//           alt={advertisement.company_name}
//           fill
//           className="object-cover"
//         />
//         <div className="absolute top-2 right-2">
//           <Badge variant={advertisement.approved ? "default" : "secondary"}>
//             {advertisement.approved ? "Approved" : "Pending"}
//           </Badge>
//         </div>
//       </div>
//       <CardContent className="p-4">
//         <h3 className="text-lg font-semibold truncate">{advertisement.company_name}</h3>
//         <p className="text-sm text-gray-500 mt-1 flex items-center">
//           <Clock className="h-3 w-3 mr-1" />
//           {createdAt}
//         </p>
//         {daysRemaining !== null && (
//           <p className={`text-sm mt-1 flex items-center ${daysRemaining <= 3 ? "text-red-500" : "text-amber-600"}`}>
//             <Calendar className="h-3 w-3 mr-1" />
//             {daysRemaining > 0 ? `Expires in ${daysRemaining} day${daysRemaining !== 1 ? "s" : ""}` : "Expired"}
//           </p>
//         )}
//         <p className="mt-2 text-sm line-clamp-2">{advertisement.product_description}</p>

//         {advertisement.payment_amount && (
//           <div className="mt-2 text-sm">
//             <span className="font-medium">Payment:</span> ${advertisement.payment_amount}
//             {advertisement.payment_duration && ` (${advertisement.payment_duration})`}
//           </div>
//         )}
//       </CardContent>
//       <CardFooter className="p-4 pt-0">
//         <Link href={`/admin/advertisements/${advertisement.id}`} className="w-full">
//           <Button variant="outline" className="w-full">
//             View Details
//           </Button>
//         </Link>
//       </CardFooter>
//     </Card>
//   )
// }
