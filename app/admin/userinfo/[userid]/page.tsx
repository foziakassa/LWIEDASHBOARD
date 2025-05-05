"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Mail, Phone, User, Briefcase, AlertCircle } from "lucide-react"
import axiosInstance from "@/shared/axiosinstance"

interface UserInfo {
  id: string
  email: string
  firstName: string
  lastName: string
  bio?: string
  phone?: string
  image?: string
  role: string
  status: string
  joinDate: string
}

// Mock data for testing when API fails
const MOCK_USER: UserInfo = {
  id: "1",
  email: "john.doe@example.com",
  firstName: "John",
  lastName: "Doe",
  bio: "This is a fallback user profile for testing purposes when the API is unavailable.",
  phone: "+1 (555) 123-4567",
  image: "",
  role: "User",
  status: "Active",
  joinDate: new Date().toISOString(),
}

const UserInfoPage = () => {
  const params = useParams()
  const router = useRouter()
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [useMockData, setUseMockData] = useState(false)

  useEffect(() => {
    fetchUser()
  }, [params])

  const fetchUser = async () => {
    // Reset states
    setLoading(true)
    setError(null)

    // Get the user ID from params
    const userId = params?.userid

    if (!userId || userId === "[userid]") {
      console.error("Invalid user ID:", userId)
      setError("Invalid user ID. Please select a valid user.")
      setLoading(false)
      return
    }

    try {
      console.log(`Fetching user with ID: ${userId}`)
      const response = await axiosInstance.get(`/users/${userId}`)

      console.log("API Response:", response.data)

      if (!response.data) {
        throw new Error("No data returned from API")
      }

      setUser({
        id: response.data.id || userId,
        email: response.data.Email || "",
        firstName: response.data.Firstname || "",
        lastName: response.data.lastname || "",
        bio: response.data.Bio || "",
        phone: response.data.Phone || "",
        image: response.data.Image || "",
        role: response.data.Role || "User",
        status: response.data.Status || "Active",
        joinDate: response.data.Createdat || new Date().toISOString(),
      })
    } catch (error: any) {
      console.error("Failed to fetch user:", error)

      // Detailed error logging
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", error.response.data)
        console.error("Error response status:", error.response.status)
        console.error("Error response headers:", error.response.headers)

        setError(`Server error (${error.response.status}): ${error.response.data?.message || "Unknown error"}`)
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request)
        setError("No response received from server. Please check your network connection.")
      } else {
        // Something happened in setting up the request that triggered an Error
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
    setUser(MOCK_USER)
    setError(null)
    setUseMockData(false)
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-500"
      case "inactive":
        return "bg-gray-500"
      case "suspended":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-purple-500"
      case "manager":
        return "bg-blue-500"
      case "user":
        return "bg-teal-500"
      default:
        return "bg-gray-500"
    }
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
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
            <h2 className="text-xl font-bold mb-2">Error Loading User</h2>
            <p className="mb-4">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => router.push("/admin/users")} variant="outline">
                Back to Users
              </Button>
              <Button onClick={() => fetchUser()} variant="outline">
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

  if (!user) {
    return (
      <div className="p-4 max-w-3xl mx-auto">
        <Card className="p-6 border-yellow-200 bg-yellow-50">
          <div className="text-center text-yellow-800">
            <h2 className="text-xl font-bold mb-2">No User Data</h2>
            <p>No user information is available.</p>
            <Button onClick={() => router.push("/admin/users")} variant="outline" className="mt-4">
              Back to Users
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
        <div className="bg-gradient-to-r from-teal-200 to-teal-600 h-32 relative">
          <Button
            onClick={() => router.push("/admin/users")}
            variant="outline"
            className="absolute top-4 right-4 bg-white hover:bg-gray-100"
          >
            Back to Users
          </Button>
        </div>

        {/* Profile content */}
        <div className="px-6 pb-6 -mt-16">
          {/* Profile image */}
          <div className="flex flex-col items-center mb-6">
            <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-md">
              <img
                src={user?.image || "/placeholder.svg?height=128&width=128"}
                alt={`${user?.firstName} ${user?.lastName}`}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=128&width=128"
                }}
              />
            </div>
            <h1 className="text-2xl font-bold mt-4">
              {user?.firstName} {user?.lastName}
            </h1>
            <div className="flex gap-2 mt-2">
              <Badge className={getRoleColor(user?.role || "")}>{user?.role}</Badge>
              <Badge className={getStatusColor(user?.status || "")}>{user?.status}</Badge>
            </div>
          </div>

          {/* User details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="bg-violet-100 p-2 rounded-full">
                  <Mail className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="text-lg font-medium">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-violet-100 p-2 rounded-full">
                  <Briefcase className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Role</h3>
                  <p className="text-lg font-medium">{user?.role}</p>
                </div>
              </div>

              {user?.phone && (
                <div className="flex items-start gap-3">
                  <div className="bg-violet-100 p-2 rounded-full">
                    <Phone className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                    <p className="text-lg font-medium">{user?.phone}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="bg-violet-100 p-2 rounded-full">
                  <User className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="text-lg font-medium">{user?.status}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-violet-100 p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Join Date</h3>
                  <p className="text-lg font-medium">{new Date(user?.joinDate || "").toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bio section */}
          {user?.bio && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Bio</h3>
              <p className="text-gray-700">{user.bio}</p>
            </div>
          )}

          {/* Action buttons */}
          {/* <div className="mt-8 flex gap-3 justify-end">
            <Button variant="outline">Edit Profile</Button>
            <Button variant="default" className="bg-teal-600 hover:bg-teal-700">
              Contact User
            </Button> */}
          {/* </div> */}
        </div>
      </Card>
    </div>
  )
}

export default UserInfoPage
