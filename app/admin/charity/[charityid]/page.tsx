"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Calendar, Info, Heart, AlertCircle, Edit, Trash2, ArrowLeft } from "lucide-react"
import axiosInstance from "@/shared/axiosinstance"
import { getUserCookie } from "@/lib/cookies"

interface Charity {
  id: string
  name: string
  description: string
  location: string
  created_at: string
  image?: string
}

// Mock data for testing when API fails
const MOCK_CHARITY: Charity = {
  id: "1",
  name: "Hope Foundation",
  description:
    "A non-profit organization dedicated to providing education and healthcare to underprivileged communities around the world.",
  location: "New York, USA",
  created_at: new Date().toISOString(),
  image: "",
}

const CharityInfoPage = () => {
  const params = useParams()
  const router = useRouter()
  const [charity, setCharity] = useState<Charity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [useMockData, setUseMockData] = useState(false)

  /// geting user info from cookie
    const [userRole, setUserRole] = useState<string | null>(null); // State for user role
    
      // Get user role from cookie
      useEffect(() => {
        const userData = getUserCookie(); // Get the user data object
        setUserRole(userData?.Role || null); // Access the Role property
      }, []);
    
    
  

  useEffect(() => {
    fetchCharity()
  }, [params])

  const fetchCharity = async () => {
    // Reset states
    setLoading(true)
    setError(null)

    // Get the charity ID from params
    const charityId = params?.charityid

    if (!charityId || charityId === "[charityid]") {
      console.error("Invalid charity ID:", charityId)
      setError("Invalid charity ID. Please select a valid charity.")
      setLoading(false)
      return
    }

    try {
      console.log(`Fetching charity with ID: ${charityId}`)
      const response = await axiosInstance.get(`/charities/${charityId}`)

      console.log("API Response:", response.data)

      if (!response.data) {
        throw new Error("No data returned from API")
      }

      setCharity({
        id: response.data.id || charityId,
        name: response.data.name || "",
        description: response.data.description || "",
        location: response.data.location || "",
        created_at: response.data.created_at || new Date().toISOString(),
        image: response.data.image || "",
      })
    } catch (error: any) {
      console.error("Failed to fetch charity:", error)

      // Detailed error logging
      if (error.response) {
        console.error("Error response data:", error.response.data)
        console.error("Error response status:", error.response.status)
        setError(`Server error (${error.response.status}): ${error.response.data?.message || "Unknown error"}`)
      } else if (error.request) {
        console.error("Error request:", error.request)
        setError("No response received from server. Please check your network connection.")
      } else {
        console.error("Error message:", error.message)
        setError(`Error: ${error.message}`)
      }

      // Offer to use mock data for testing
      setUseMockData(true)
    } finally {
      setLoading(false)
    }
  }

  const handleUseMockData = () => {
    setCharity(MOCK_CHARITY)
    setError(null)
    setUseMockData(false)
  }

  const handleDeleteCharity = async () => {
    if (!charity) return

    if (confirm("Are you sure you want to delete this charity?")) {
      try {
        await axiosInstance.delete(`/charities/${charity.id}`)
        alert("Charity deleted successfully.")
        router.push("/admin/charity")
      } catch (error) {
        console.error("Failed to delete charity:", error)
        alert("Failed to delete charity.")
      }
    }
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (loading) {
    return (
      <div className="p-4 max-w-3xl mx-auto">
        <Card className="p-6">
          <div className="flex flex-col items-center mb-8">
            <Skeleton className="h-32 w-32 rounded-full" />
            <Skeleton className="h-8 w-64 mt-4" />
            <Skeleton className="h-4 w-40 mt-2" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 max-w-3xl mx-auto">
        <Card className="p-6 border-red-200 bg-red-50">
          <div className="text-center text-red-600">
            <AlertCircle className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Error Loading Charity</h2>
            <p className="mb-4">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => router.push("/admin/charity")} variant="outline">
                Back to Charities
              </Button>
              <Button onClick={() => fetchCharity()} variant="outline">
                Try Again
              </Button>
              {useMockData && (
                <Button onClick={handleUseMockData} variant="default">
                  Use Test Data
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (!charity) {
    return (
      <div className="p-4 max-w-3xl mx-auto">
        <Card className="p-6 border-yellow-200 bg-yellow-50">
          <div className="text-center text-yellow-800">
            <h2 className="text-xl font-bold mb-2">No Charity Data</h2>
            <p>No charity information is available.</p>
            <Button onClick={() => router.push("/admin/charity")} variant="outline" className="mt-4">
              Back to Charities
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Card className="overflow-hidden border-0 shadow-lg">
        {/* Header with background */}
        <div className="bg-gradient-to-r from-teal-500 to-emerald-600 h-32 relative">
          <Button
            onClick={() => router.push("/admin/charity")}
            variant="outline"
            className="absolute top-4 left-4 bg-white hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Charity content */}
        <div className="px-6 pb-6 -mt-16">
          {/* Charity logo/image */}
          <div className="flex flex-col items-center mb-6">
            <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-md flex items-center justify-center">
              {charity.image ? (
                <img
                  src={charity.image || "/placeholder.svg"}
                  alt={charity.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=128&width=128"
                  }}
                />
              ) : (
                <Heart className="h-16 w-16 text-teal-500" />
              )}
            </div>
            <h1 className="text-2xl font-bold mt-4 text-center">{charity.name}</h1>
            <Badge className="mt-2 bg-teal-500">{charity.location}</Badge>
          </div>

          {/* Charity details */}
          <div className="space-y-6 mt-8">
            <div className="flex items-start gap-3">
              <div className="bg-teal-100 p-2 rounded-full">
                <Info className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">About</h3>
                <p className="text-gray-700 mt-1">{charity.description}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-teal-100 p-2 rounded-full">
                <MapPin className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Location</h3>
                <p className="text-lg font-medium">{charity.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-teal-100 p-2 rounded-full">
                <Calendar className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Established</h3>
                <p className="text-lg font-medium">{formatDate(charity.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Statistics section - placeholder for future data */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-teal-600">0</p>
              <p className="text-sm text-gray-500">Campaigns</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-teal-600">$0</p>
              <p className="text-sm text-gray-500">Raised</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-teal-600">0</p>
              <p className="text-sm text-gray-500">Donors</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex gap-3 justify-end">
            {userRole !== "Admin" && (
               <Button
               variant="outline"
               className="text-red-500 border-red-200 hover:bg-red-50"
               onClick={handleDeleteCharity}
             >
               <Trash2 className="h-4 w-4 mr-2" />
               Delete
             </Button>

            )}
           
            {/* <Button variant="outline" onClick={() => router.push(`/admin/charity/edit/${charity.id}`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" className="bg-teal-600 hover:bg-teal-700">
              View Campaigns
            </Button> */}
          </div>
        </div>
      </Card>
    </div>
  )
}
export default CharityInfoPage
