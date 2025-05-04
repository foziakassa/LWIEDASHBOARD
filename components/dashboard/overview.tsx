// "use client"

// import { useEffect, useState } from "react"
// import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

// interface Visitor {
//   ip_address: string
//   visit_time: string
// }

// interface DailyData {
//   name: string
//   total: number
//   fullDate: string
// }

// export function Overview() {
//   const [dailyData, setDailyData] = useState<DailyData[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     async function fetchVisitorData() {
//       try {
//         setLoading(true)
//         const response = await fetch("https://liwedoc.vercel.app/visitors")

//         if (!response.ok) {
//           throw new Error("Failed to fetch visitor data")
//         }

//         const visitors: Visitor[] = await response.json()

//         // Process visitors into daily unique counts
//         const dailyVisitors = processDailyUniqueVisitors(visitors)
//         setDailyData(dailyVisitors)
//       } catch (err) {
//         console.error("Error fetching visitor data:", err)
//         setError("Failed to load visitor data")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchVisitorData()
//   }, [])

//   // Function to process visitors into daily unique counts
//   function processDailyUniqueVisitors(visitors: Visitor[]): DailyData[] {
//     // Group visitors by day
//     const dayMap = new Map<string, Set<string>>()

//     visitors.forEach((visitor) => {
//       const visitDate = new Date(visitor.visit_time)
//       const dayKey = visitDate.toISOString().split("T")[0] // YYYY-MM-DD format

//       if (!dayMap.has(dayKey)) {
//         dayMap.set(dayKey, new Set())
//       }

//       // Add IP to the set for this day (sets only store unique values)
//       dayMap.get(dayKey)?.add(visitor.ip_address)
//     })

//     // Convert map to array for chart data
//     const dailyData: DailyData[] = Array.from(dayMap.entries())
//       .map(([dayKey, ipSet]) => {
//         const date = new Date(dayKey)

//         return {
//           name: formatShortDate(date),
//           fullDate: formatFullDate(date),
//           total: ipSet.size, // Number of unique IPs
//         }
//       })
//       .sort((a, b) => {
//         // Sort by date
//         return new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime()
//       })

//     // Take the last 14 days if we have more data
//     return dailyData.slice(-14)
//   }

//   // Helper function to format date as MM/DD
//   function formatShortDate(date: Date): string {
//     return `${date.getMonth() + 1}/${date.getDate()}`
//   }

//   // Helper function to format full date
//   function formatFullDate(date: Date): string {
//     return date.toLocaleDateString("en-US", {
//       weekday: "short",
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     })
//   }

//   if (loading) {
//     return <div className="flex justify-center items-center h-[350px]">Loading visitor data...</div>
//   }

//   if (error) {
//     return <div className="flex justify-center items-center h-[350px] text-red-500">{error}</div>
//   }

//   return (
//     <ResponsiveContainer width="100%" height={350}>
//       <BarChart data={dailyData}>
//         <XAxis
//           dataKey="name"
//           stroke="#888888"
//           fontSize={12}
//           tickLine={false}
//           axisLine={false}
//           interval={0} // Show all labels
//         />
//         <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
//         <Tooltip
//           formatter={(value) => [`${value} unique visitors`, "Total"]}
//           labelFormatter={(label, data) => {
//             if (data && data[0]) {
//               return data[0].payload.fullDate
//             }
//             return label
//           }}
//         />
//         <Bar dataKey="total" fill="#004D4D" radius={[4, 4, 0, 0]} name="Unique Visitors" />
//       </BarChart>
//     </ResponsiveContainer>
//   )


// }


"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface Visitor {
  ip_address: string
  visit_time: string
}

interface WeeklyData {
  name: string
  total: number
  startDate: string // ISO string for the start of the week
}

export function Overview() {
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([])
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

        // Process visitors into weekly unique counts
        const weeklyVisitors = processWeeklyUniqueVisitors(visitors)
        setWeeklyData(weeklyVisitors)
      } catch (err) {
        console.error("Error fetching visitor data:", err)
        setError("Failed to load visitor data")
      } finally {
        setLoading(false)
      }
    }

    fetchVisitorData()
  }, [])

  // Function to process visitors into weekly unique counts
  function processWeeklyUniqueVisitors(visitors: Visitor[]): WeeklyData[] {
    const weekMap = new Map<string, Set<string>>()

    visitors.forEach((visitor) => {
      const visitDate = new Date(visitor.visit_time)
      const startOfWeek = getStartOfWeek(visitDate) // Get the start of the week
      const weekKey = startOfWeek.toISOString().split("T")[0] // Use ISO string as key

      if (!weekMap.has(weekKey)) {
        weekMap.set(weekKey, new Set())
      }

      weekMap.get(weekKey)?.add(visitor.ip_address)
    })

    const weeklyData: WeeklyData[] = Array.from(weekMap.entries())
      .map(([weekKey, ipSet]) => {
        const startDate = new Date(weekKey)

        return {
          name: formatWeekRange(startDate), // Format the week range for display
          startDate: weekKey, // Keep the start date for sorting
          total: ipSet.size,
        }
      })
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()) // Sort by start date

    return weeklyData.slice(-12) // Display last 12 weeks
  }

  // Function to get the start of the week (Sunday)
  function getStartOfWeek(date: Date): Date {
    const day = date.getDay() // 0 for Sunday, 1 for Monday, etc.
    const diff = date.getDate() - day
    return new Date(date.setDate(diff)) // Adjust back to Sunday
  }

  // Function to format the week range
  function formatWeekRange(startDate: Date): string {
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 6) // Add 6 days to get the end of the week

    const startMonth = startDate.toLocaleString("default", { month: "short" })
    const startDay = startDate.getDate()
    const endMonth = endDate.toLocaleString("default", { month: "short" })
    const endDay = endDate.getDate()

    return `${startMonth} ${startDay} - ${endMonth} ${endDay}`
  }

  if (loading) {
    return <div className="flex justify-center items-center h-[350px]">Loading visitor data...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-[350px] text-red-500">{error}</div>
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={weeklyData}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          interval={0}
        />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip
          formatter={(value) => [`${value} unique visitors`, "Total"]}
          labelFormatter={(label, data) => {
            if (data && data[0]) {
              return `Week of ${data[0].payload.startDate}`
            }
            return label
          }}
        />
        <Bar dataKey="total" fill="#004D4D" radius={[4, 4, 0, 0]} name="Unique Visitors" />
      </BarChart>
    </ResponsiveContainer>
  )
}
