"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { Bell, Check } from "lucide-react"
import { approveAdvertisement } from "./action"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import fetcher from "@/shared/fecher"
import { CardFooter } from "@/components/ui/card"
import { ApproveAdvertisementForm } from "../advertisements/components/approval-form"
import AllAdvertisment from "../advertisements/components/allad/page"
type Notification = {
  id: number
  company_name: string
  email: string
  phone_number: string
  product_description: string
  created_at?: string
  approved?: boolean
}

export default function NotificationsComponent() {
  const router = useRouter()
  const notificationRef = useRef<HTMLDivElement>(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch notifications function - defined outside useEffect for reusability
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true)
      console.log("Fetching notifications...")

      const response = await fetcher("/advertisements")
      console.log("API response:", response)

      if (response && Array.isArray(response)) { // Check if response exists and is an array
        // Filter out only unapproved advertisements if needed
        const pendingAds = response.filter((ad: Notification) => !ad.approved)
        console.log("Response data:", response) // Corrected log
        console.log("Pending ads to set:", pendingAds)
        setNotifications(pendingAds)
      } else {
        console.log("No data in response or invalid response format")
        setNotifications([])
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications()

    // Poll for new notifications every 5 minutes
    const interval = setInterval(fetchNotifications, 300000)

    return () => clearInterval(interval)
  }, [fetchNotifications])

  // Log notifications state AFTER it updates
  useEffect(() => {
    console.log("Current notifications state:", notifications)
  }, [notifications])

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])
  // Handle approve advertisement
  const handleApprove = async (id: number) => {
    try {
      await approveAdvertisement(id.toString())

      // Update notifications list - remove the approved notification
      setNotifications((prev) => prev.filter((notification) => notification.id !== id))

      toast({
        title: "Success",
        description: "Advertisement has been approved",
      })
    } catch (error) {
      console.error("Error approving advertisement:", error)
      toast({
        title: "Error",
        description: "Failed to approve advertisement",
        variant: "destructive",
      })
    }
  }

  // Handle view advertisement details
  const handleViewDetails = (id: number) => {
    router.push(`/admin/advertisements/${id}`)
    setShowNotifications(false)
  }

  // Format time ago from date string
  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return ""

    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds} sec ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    return `${Math.floor(diffInSeconds / 86400)} days ago`
  }

  // For debugging - force immediate fetch
  const handleManualRefresh = () => {
    fetchNotifications()
  }

  return (
    <div className="relative" ref={notificationRef}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowNotifications(!showNotifications)}
        className="text-white bg-teal-600 p-2 rounded-full relative"
      >
        <Bell className="h-6 w-6" />
        {notifications && notifications.length > 0 && (
          <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-10"
          >
            <div className="flex justify-between items-center px-4 py-2 bg-teal-50 dark:bg-teal-900">
              <h3 className="font-medium text-teal-900 dark:text-white">Notifications</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleManualRefresh}
                  className="text-sm text-teal-600 dark:text-teal-400 hover:underline"
                >
                  Refresh
                </button>
                <Link
                  href="/admin/advertisements/components/allad"
                  className="text-sm text-teal-600 dark:text-teal-400 hover:underline"
                  onClick={() => setShowNotifications(false)}
                >
                  View All
                </Link>
              </div>
            </div>

            {loading ? (
              <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">Loading notifications...</div>
            ) : !notifications || notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">No new notifications</div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex justify-between">
                      <p className="font-medium text-gray-900 dark:text-white">{notification.company_name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTimeAgo(notification.created_at)}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">New advertisement submission</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                      {notification.product_description}
                    </p>

                    {!notification.approved && (
                      <div className="flex space-x-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 h-8"
                          onClick={() => handleViewDetails(notification.id)}
                        >
                          Details
                        </Button>
                        
                        {/* <Button
                          size="sm"
                          className="flex-1 h-8 bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(notification.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button> */}
                        <CardFooter>
                            <ApproveAdvertisementForm id={notification.id} />
                          </CardFooter>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}