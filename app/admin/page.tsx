"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Overview } from "@/components/dashboard/overview"
import { RecentItems } from "@/components/dashboard/recent-items"
import { FileText, Package, BarChart3, Upload } from "lucide-react"

interface StatsItem {
  title: string
  value: string | number // Allow number for dynamic value
  icon: React.ComponentType<{ className?: string }> // Correct type for icon
}

const initialStats: StatsItem[] = [
  {
    title: "Total Users", // Changed title
    value: "Loading...", // Initial loading state
    icon: FileText, // Changed icon (optional, use a user icon if you have one)
  },
  {
    title: "Total Items",
    value: "Loading...", // Initial loading state
    icon: Package,
  },
  {
    title: "Total Specifications",
    value: "42",
    icon: BarChart3,
  },
  {
    title: "Uploaded Files",
    value: "8",
    icon: Upload,
  },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsItem[]>(initialStats)

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch("https://liwedoc.vercel.app/users") // Use user API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch user data")
        }
        const data = await response.json()
        const userCount = Array.isArray(data) ? data.length : 0

        // Update the "Total Users" stat with the user count from the API
        setStats((prevStats) => {
          const newStats = [...prevStats]
          newStats[0] = { ...newStats[0], value: userCount } // Update the value
          return newStats
        })
      } catch (error) {
        console.error("Error fetching user data:", error)
        // Handle error - display an error message or default value
        setStats((prevStats) => {
          const newStats = [...prevStats]
          newStats[0] = { ...newStats[0], value: "Error" } // Display "Error" or a default value
          return newStats
        })
      }
    }

    async function fetchItemCount() {
      try {
        const response = await fetch("https://liwedoc.vercel.app/api/items")
        if (!response.ok) {
          throw new Error("Failed to fetch item count")
        }
        const data = await response.json()

        // Update the "Total Items" stat with the count from the API
        setStats((prevStats) => {
          const newStats = [...prevStats]
          newStats[1] = { ...newStats[1], value: data.count } // Update the value
          return newStats
        })
      } catch (error) {
        console.error("Error fetching item count:", error)
        // Handle error - display an error message or default value
        setStats((prevStats) => {
          const newStats = [...prevStats]
          newStats[1] = { ...newStats[1], value: "Error" } // Display "Error" or a default value
          return newStats
        })
      }
    }

    fetchUserData()
    fetchItemCount()
  }, []) // Empty dependency array - run only once on mount

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-semibold mt-1">{stat.value}</h3>
              </div>
              <stat.icon className="h-5 w-5 text-gray-400" />
            </div>
          </Card>
        ))}
      </div>
      <Card>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Overview</h2>
          <Overview />
        </div>
      </Card>
      <Card>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Recent Items</h2>
          <RecentItems />
        </div>
      </Card>
    </div>
  )
}