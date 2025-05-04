"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface Visitor {
  ip_address: string
  visit_time: string
}

interface ChartData {
  name: string
  total: number
  startDate?: string // ISO string for the start of the period (optional)
}

type TimePeriod = "daily" | "weekly" | "monthly" | "annual"

export function Overview() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("monthly") // Default to monthly
  const [chartData, setChartData] = useState<ChartData[]>([])
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

        // Process visitors based on the selected time period
        let processedData: ChartData[] = []
        switch (timePeriod) {
          case "daily":
            processedData = processDailyUniqueVisitors(visitors)
            break
          case "weekly":
            processedData = processWeeklyUniqueVisitors(visitors)
            break
          case "monthly":
            processedData = processMonthlyUniqueVisitors(visitors)
            break
          case "annual":
            processedData = processAnnualUniqueVisitors(visitors)
            break
        }

        setChartData(processedData)
      } catch (err) {
        console.error("Error fetching visitor data:", err)
        setError("Failed to load visitor data")
      } finally {
        setLoading(false)
      }
    }

    fetchVisitorData()
  }, [timePeriod]) // Re-fetch data when the time period changes

  // --- Data Processing Functions ---

  function processDailyUniqueVisitors(visitors: Visitor[]): ChartData[] {
    const dayMap = new Map<string, Set<string>>()

    visitors.forEach((visitor) => {
      const visitDate = new Date(visitor.visit_time)
      const dayKey = visitDate.toISOString().split("T")[0] // YYYY-MM-DD format

      if (!dayMap.has(dayKey)) {
        dayMap.set(dayKey, new Set())
      }

      dayMap.get(dayKey)?.add(visitor.ip_address)
    })

    const dailyData: ChartData[] = Array.from(dayMap.entries())
      .map(([dayKey, ipSet]) => {
        const date = new Date(dayKey)

        return {
          name: formatShortDate(date),
          total: ipSet.size,
        }
      })
      .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime())

    return dailyData.slice(-14)
  }

  function processWeeklyUniqueVisitors(visitors: Visitor[]): ChartData[] {
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

    const weeklyData: ChartData[] = Array.from(weekMap.entries())
      .map(([weekKey, ipSet]) => {
        const startDate = new Date(weekKey)

        return {
          name: formatWeekRange(startDate), // Format the week range for display
          startDate: weekKey, // Keep the start date for sorting
          total: ipSet.size,
        }
      })
      .sort((a, b) => new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime()) // Sort by start date

    return weeklyData.slice(-12) // Display last 12 weeks
  }

  function processMonthlyUniqueVisitors(visitors: Visitor[]): ChartData[] {
    const monthMap = new Map<string, Set<string>>()

    visitors.forEach((visitor) => {
      const visitDate = new Date(visitor.visit_time)
      const startOfMonth = getStartOfMonth(visitDate) // Get the start of the month
      const monthKey = startOfMonth.toISOString().split("T")[0] // Use ISO string as key

      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, new Set())
      }

      monthMap.get(monthKey)?.add(visitor.ip_address)
    })

    const monthlyData: ChartData[] = Array.from(monthMap.entries())
      .map(([monthKey, ipSet]) => {
        const startDate = new Date(monthKey)

        return {
          name: formatMonth(startDate), // Format the month for display
          startDate: monthKey, // Keep the start date for sorting
          total: ipSet.size,
        }
      })
      .sort((a, b) => new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime()) // Sort by start date

    return monthlyData.slice(-12) // Display last 12 months
  }

  function processAnnualUniqueVisitors(visitors: Visitor[]): ChartData[] {
    const yearMap = new Map<string, Set<string>>()

    visitors.forEach((visitor) => {
      const visitDate = new Date(visitor.visit_time)
      const year = visitDate.getFullYear().toString()

      if (!yearMap.has(year)) {
        yearMap.set(year, new Set())
      }

      yearMap.get(year)?.add(visitor.ip_address)
    })

    const annualData: ChartData[] = Array.from(yearMap.entries())
      .map(([year, ipSet]) => ({
        name: year,
        total: ipSet.size,
      }))
      .sort((a, b) => parseInt(a.name) - parseInt(b.name))

    return annualData.slice(-5) // Display last 5 years
  }

  // --- Helper Functions ---

  function getStartOfWeek(date: Date): Date {
    const day = date.getDay()
    const diff = date.getDate() - day
    return new Date(date.setDate(diff))
  }

  function getStartOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1)
  }

  function formatShortDate(date: Date): string {
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  function formatWeekRange(startDate: Date): string {
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 6)

    const startMonth = startDate.toLocaleString("default", { month: "short" })
    const startDay = startDate.getDate()
    const endMonth = endDate.toLocaleString("default", { month: "short" })
    const endDay = endDate.getDate()

    return `${startMonth} ${startDay} - ${endMonth} ${endDay}`
  }

  function formatMonth(startDate: Date): string {
    return startDate.toLocaleString("default", { month: "long", year: "numeric" })
  }

  // --- Render ---

  if (loading) {
    return <div className="flex justify-center items-center h-[350px]">Loading visitor data...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-[350px] text-red-500">{error}</div>
  }

  return (
    <div>
      {/* Time Period Selector */}
      <div className="mb-4">
        <label htmlFor="timePeriod" className="mr-2">
          View:
        </label>
        <select
          id="timePeriod"
          className="border rounded px-2 py-1"
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value as TimePeriod)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="annual">Annual</option>
        </select>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData}>
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
                if (timePeriod === "weekly" && data[0].payload.startDate) {
                  return `Week of ${data[0].payload.startDate}`
                } else if (timePeriod === "monthly" && data[0].payload.startDate) {
                  return `${data[0].payload.name}` // Display the full month name
                }
                return `${data[0].payload.name}`
              }
              return label
            }}
          />
          <Bar dataKey="total" fill="#004D4D" radius={[4, 4, 0, 0]} name="Unique Visitors" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}