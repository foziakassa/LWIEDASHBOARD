"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface Visitor {
  ip_address: string
  visit_time: string
}

interface DailyData {
  name: string
  total: number
  fullDate: string
}

export function Overview() {
  const [dailyData, setDailyData] = useState<DailyData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchVisitorData() {
      try {
        setLoading(true)
        const response = await fetch("https://liwedoc.vercel.app/visitors")

        if (!response.ok) {
          throw new Error("Failed to fetch visitor data")
        }

        const visitors: Visitor[] = await response.json()

        // Process visitors into daily unique counts
        const dailyVisitors = processDailyUniqueVisitors(visitors)
        setDailyData(dailyVisitors)
      } catch (err) {
        console.error("Error fetching visitor data:", err)
        setError("Failed to load visitor data")
      } finally {
        setLoading(false)
      }
    }

    fetchVisitorData()
  }, [])

  // Function to process visitors into daily unique counts
  function processDailyUniqueVisitors(visitors: Visitor[]): DailyData[] {
    // Group visitors by day
    const dayMap = new Map<string, Set<string>>()

    visitors.forEach((visitor) => {
      const visitDate = new Date(visitor.visit_time)
      const dayKey = visitDate.toISOString().split("T")[0] // YYYY-MM-DD format

      if (!dayMap.has(dayKey)) {
        dayMap.set(dayKey, new Set())
      }

      // Add IP to the set for this day (sets only store unique values)
      dayMap.get(dayKey)?.add(visitor.ip_address)
    })

    // Convert map to array for chart data
    const dailyData: DailyData[] = Array.from(dayMap.entries())
      .map(([dayKey, ipSet]) => {
        const date = new Date(dayKey)

        return {
          name: formatShortDate(date),
          fullDate: formatFullDate(date),
          total: ipSet.size, // Number of unique IPs
        }
      })
      .sort((a, b) => {
        // Sort by date
        return new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime()
      })

    // Take the last 14 days if we have more data
    return dailyData.slice(-14)
  }

  // Helper function to format date as MM/DD
  function formatShortDate(date: Date): string {
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  // Helper function to format full date
  function formatFullDate(date: Date): string {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (loading) {
    return <div className="flex justify-center items-center h-[350px]">Loading visitor data...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-[350px] text-red-500">{error}</div>
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={dailyData}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          interval={0} // Show all labels
        />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip
          formatter={(value) => [`${value} unique visitors`, "Total"]}
          labelFormatter={(label, data) => {
            if (data && data[0]) {
              return data[0].payload.fullDate
            }
            return label
          }}
        />
        <Bar dataKey="total" fill="#004D4D" radius={[4, 4, 0, 0]} name="Unique Visitors" />
      </BarChart>
    </ResponsiveContainer>
  )
}
