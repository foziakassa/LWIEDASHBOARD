"use client"

import { useEffect, useState } from "react"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts"

interface Visitor {
  ip_address: string
  visit_time: string
}

interface User {
  id: number
  Firstname: string
  Lastname: string
  Email: string
  Createdat: string
  activated: boolean
  Role: string
}

interface ChartData {
  name: string
  visitors?: number
  users?: number
  startDate?: string
}

type TimePeriod = "daily" | "weekly" | "monthly" | "annual"
type DataType = "visitors" | "users" | "comparison"

export function Overview() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("monthly")
  const [dataType, setDataType] = useState<DataType>("visitors")
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        let visitors: Visitor[] = []
        let users: User[] = []

        if (dataType === "visitors" || dataType === "comparison") {
          const visitorResponse = await fetch("https://liwedoc.vercel.app/visitors")
          if (!visitorResponse.ok) {
            throw new Error("Failed to fetch visitor data")
          }
          visitors = await visitorResponse.json()
        }

        if (dataType === "users" || dataType === "comparison") {
          const userResponse = await fetch("https://liwedoc.vercel.app/users")
          if (!userResponse.ok) {
            throw new Error("Failed to fetch user data")
          }
          users = await userResponse.json()
        }

        let processedData: ChartData[] = []

        switch (dataType) {
          case "visitors":
            processedData = processVisitorData(visitors, timePeriod)
            break
          case "users":
            processedData = processUserData(users, timePeriod)
            break
          case "comparison":
            processedData = processComparisonData(visitors, users, timePeriod)
            break
        }

        setChartData(processedData)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timePeriod, dataType])

  // --- Data Processing Functions ---

  function processVisitorData(visitors: Visitor[], timePeriod: TimePeriod): ChartData[] {
    switch (timePeriod) {
      case "daily":
        return processDailyVisitors(visitors)
      case "weekly":
        return processWeeklyVisitors(visitors)
      case "monthly":
        return processMonthlyVisitors(visitors)
      case "annual":
        return processAnnualVisitors(visitors)
      default:
        return []
    }
  }

  function processUserData(users: User[], timePeriod: TimePeriod): ChartData[] {
    switch (timePeriod) {
      case "daily":
        return processDailyUsers(users)
      case "weekly":
        return processWeeklyUsers(users)
      case "monthly":
        return processMonthlyUsers(users)
      case "annual":
        return processAnnualUsers(users)
      default:
        return []
    }
  }

  function processComparisonData(visitors: Visitor[], users: User[], timePeriod: TimePeriod): ChartData[] {
    switch (timePeriod) {
      case "daily":
        return processDailyComparison(visitors, users)
      case "weekly":
        return processWeeklyComparison(visitors, users)
      case "monthly":
        return processMonthlyComparison(visitors, users)
      case "annual":
        return processAnnualComparison(visitors, users)
      default:
        return []
    }
  }

  // --- Visitor Data Processing ---

  function processDailyVisitors(visitors: Visitor[]): ChartData[] {
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

    const dailyData: ChartData[] = Array.from(dayMap.entries())
      .map(([dayKey, ipSet]) => {
        const date = new Date(dayKey)

        return {
          name: formatShortDate(date),
          visitors: ipSet.size,
          startDate: dayKey, // Keep the original date for sorting
        }
      })
      .sort((a, b) => new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime())

    return dailyData.slice(-14) // Last 14 days
  }

  function processWeeklyVisitors(visitors: Visitor[]): ChartData[] {
    const weekMap = new Map<string, Set<string>>()

    visitors.forEach((visitor) => {
      const visitDate = new Date(visitor.visit_time)
      const startOfWeek = getStartOfWeek(visitDate)
      const weekKey = startOfWeek.toISOString().split("T")[0]

      if (!weekMap.has(weekKey)) {
        weekMap.set(weekKey, new Set())
      }

      weekMap.get(weekKey)?.add(visitor.ip_address)
    })

    const weeklyData: ChartData[] = Array.from(weekMap.entries())
      .map(([weekKey, ipSet]) => {
        const startDate = new Date(weekKey)

        return {
          name: formatWeekRange(startDate),
          visitors: ipSet.size,
          startDate: weekKey,
        }
      })
      .sort((a, b) => new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime())

    return weeklyData.slice(-12) // Last 12 weeks
  }

  function processMonthlyVisitors(visitors: Visitor[]): ChartData[] {
    const monthMap = new Map<string, Set<string>>()

    visitors.forEach((visitor) => {
      const visitDate = new Date(visitor.visit_time)
      const monthKey = `${visitDate.getFullYear()}-${String(visitDate.getMonth() + 1).padStart(2, "0")}`

      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, new Set())
      }

      monthMap.get(monthKey)?.add(visitor.ip_address)
    })

    const monthlyData: ChartData[] = Array.from(monthMap.entries())
      .map(([monthKey, ipSet]) => {
        const [year, month] = monthKey.split("-")
        const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1, 1)

        return {
          name: formatMonth(date),
          visitors: ipSet.size,
          startDate: monthKey,
        }
      })
      .sort((a, b) => {
        const [aYear, aMonth] = a.startDate!.split("-")
        const [bYear, bMonth] = b.startDate!.split("-")
        return Number.parseInt(aYear) - Number.parseInt(bYear) || Number.parseInt(aMonth) - Number.parseInt(bMonth)
      })

    return monthlyData.slice(-12) // Last 12 months
  }

  function processAnnualVisitors(visitors: Visitor[]): ChartData[] {
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
        visitors: ipSet.size,
        startDate: year,
      }))
      .sort((a, b) => Number.parseInt(a.startDate!) - Number.parseInt(b.startDate!))

    return annualData.slice(-5) // Last 5 years
  }

  // --- User Data Processing ---

  function processDailyUsers(users: User[]): ChartData[] {
    const dayMap = new Map<string, number>()

    users.forEach((user) => {
      const createdAt = new Date(user.Createdat)
      const dayKey = createdAt.toISOString().split("T")[0] // YYYY-MM-DD format

      dayMap.set(dayKey, (dayMap.get(dayKey) || 0) + 1)
    })

    const dailyData: ChartData[] = Array.from(dayMap.entries())
      .map(([dayKey, count]) => {
        const date = new Date(dayKey)

        return {
          name: formatShortDate(date),
          users: count,
          startDate: dayKey,
        }
      })
      .sort((a, b) => new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime())

    return dailyData.slice(-14) // Last 14 days
  }

  function processWeeklyUsers(users: User[]): ChartData[] {
    const weekMap = new Map<string, number>()

    users.forEach((user) => {
      const createdAt = new Date(user.Createdat)
      const startOfWeek = getStartOfWeek(createdAt)
      const weekKey = startOfWeek.toISOString().split("T")[0]

      weekMap.set(weekKey, (weekMap.get(weekKey) || 0) + 1)
    })

    const weeklyData: ChartData[] = Array.from(weekMap.entries())
      .map(([weekKey, count]) => {
        const startDate = new Date(weekKey)

        return {
          name: formatWeekRange(startDate),
          users: count,
          startDate: weekKey,
        }
      })
      .sort((a, b) => new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime())

    return weeklyData.slice(-12) // Last 12 weeks
  }

  function processMonthlyUsers(users: User[]): ChartData[] {
    const monthMap = new Map<string, number>()

    users.forEach((user) => {
      const createdAt = new Date(user.Createdat)
      const monthKey = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, "0")}`

      monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1)
    })

    const monthlyData: ChartData[] = Array.from(monthMap.entries())
      .map(([monthKey, count]) => {
        const [year, month] = monthKey.split("-")
        const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1, 1)

        return {
          name: formatMonth(date),
          users: count,
          startDate: monthKey,
        }
      })
      .sort((a, b) => {
        const [aYear, aMonth] = a.startDate!.split("-")
        const [bYear, bMonth] = b.startDate!.split("-")
        return Number.parseInt(aYear) - Number.parseInt(bYear) || Number.parseInt(aMonth) - Number.parseInt(bMonth)
      })

    return monthlyData.slice(-12) // Last 12 months
  }

  function processAnnualUsers(users: User[]): ChartData[] {
    const yearMap = new Map<string, number>()

    users.forEach((user) => {
      const createdAt = new Date(user.Createdat)
      const year = createdAt.getFullYear().toString()

      yearMap.set(year, (yearMap.get(year) || 0) + 1)
    })

    const annualData: ChartData[] = Array.from(yearMap.entries())
      .map(([year, count]) => ({
        name: year,
        users: count,
        startDate: year,
      }))
      .sort((a, b) => Number.parseInt(a.startDate!) - Number.parseInt(b.startDate!))

    return annualData.slice(-5) // Last 5 years
  }

  // --- Comparison Data Processing ---

  function processDailyComparison(visitors: Visitor[], users: User[]): ChartData[] {
    const visitorData = processDailyVisitors(visitors)
    const userData = processDailyUsers(users)

    // Create a map of all dates
    const allDates = new Map<string, ChartData>()

    // Add visitor data to the map
    visitorData.forEach((item) => {
      allDates.set(item.startDate!, {
        name: item.name,
        visitors: item.visitors,
        users: 0,
        startDate: item.startDate,
      })
    })

    // Add or merge user data
    userData.forEach((item) => {
      if (allDates.has(item.startDate!)) {
        const existing = allDates.get(item.startDate!)!
        existing.users = item.users
      } else {
        allDates.set(item.startDate!, {
          name: item.name,
          visitors: 0,
          users: item.users,
          startDate: item.startDate,
        })
      }
    })

    // Convert map to array and sort by date
    return Array.from(allDates.values())
      .sort((a, b) => new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime())
      .slice(-14) // Last 14 days
  }

  function processWeeklyComparison(visitors: Visitor[], users: User[]): ChartData[] {
    const visitorData = processWeeklyVisitors(visitors)
    const userData = processWeeklyUsers(users)

    // Create a map of all weeks
    const allWeeks = new Map<string, ChartData>()

    // Add visitor data to the map
    visitorData.forEach((item) => {
      allWeeks.set(item.startDate!, {
        name: item.name,
        visitors: item.visitors,
        users: 0,
        startDate: item.startDate,
      })
    })

    // Add or merge user data
    userData.forEach((item) => {
      if (allWeeks.has(item.startDate!)) {
        const existing = allWeeks.get(item.startDate!)!
        existing.users = item.users
      } else {
        allWeeks.set(item.startDate!, {
          name: item.name,
          visitors: 0,
          users: item.users,
          startDate: item.startDate,
        })
      }
    })

    // Convert map to array and sort by date
    return Array.from(allWeeks.values())
      .sort((a, b) => new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime())
      .slice(-12) // Last 12 weeks
  }

  function processMonthlyComparison(visitors: Visitor[], users: User[]): ChartData[] {
    const visitorData = processMonthlyVisitors(visitors)
    const userData = processMonthlyUsers(users)

    // Create a map of all months
    const allMonths = new Map<string, ChartData>()

    // Add visitor data to the map
    visitorData.forEach((item) => {
      allMonths.set(item.startDate!, {
        name: item.name,
        visitors: item.visitors,
        users: 0,
        startDate: item.startDate,
      })
    })

    // Add or merge user data
    userData.forEach((item) => {
      if (allMonths.has(item.startDate!)) {
        const existing = allMonths.get(item.startDate!)!
        existing.users = item.users
      } else {
        allMonths.set(item.startDate!, {
          name: item.name,
          visitors: 0,
          users: item.users,
          startDate: item.startDate,
        })
      }
    })

    // Convert map to array and sort by date
    return Array.from(allMonths.values())
      .sort((a, b) => {
        const [aYear, aMonth] = a.startDate!.split("-")
        const [bYear, bMonth] = b.startDate!.split("-")
        return Number.parseInt(aYear) - Number.parseInt(bYear) || Number.parseInt(aMonth) - Number.parseInt(bMonth)
      })
      .slice(-12) // Last 12 months
  }

  function processAnnualComparison(visitors: Visitor[], users: User[]): ChartData[] {
    const visitorData = processAnnualVisitors(visitors)
    const userData = processAnnualUsers(users)

    // Create a map of all years
    const allYears = new Map<string, ChartData>()

    // Add visitor data to the map
    visitorData.forEach((item) => {
      allYears.set(item.startDate!, {
        name: item.name,
        visitors: item.visitors,
        users: 0,
        startDate: item.startDate,
      })
    })

    // Add or merge user data
    userData.forEach((item) => {
      if (allYears.has(item.startDate!)) {
        const existing = allYears.get(item.startDate!)!
        existing.users = item.users
      } else {
        allYears.set(item.startDate!, {
          name: item.name,
          visitors: 0,
          users: item.users,
          startDate: item.startDate,
        })
      }
    })

    // Convert map to array and sort by year
    return Array.from(allYears.values())
      .sort((a, b) => Number.parseInt(a.startDate!) - Number.parseInt(b.startDate!))
      .slice(-5) // Last 5 years
  }

  // --- Helper Functions ---

  function getStartOfWeek(date: Date): Date {
    const result = new Date(date)
    const day = result.getDay() // 0 = Sunday, 1 = Monday, etc.
    const diff = result.getDate() - day // Adjust to get to Sunday
    result.setDate(diff)
    result.setHours(0, 0, 0, 0)
    return result
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

  function formatMonth(date: Date): string {
    return date.toLocaleString("default", { month: "long", year: "numeric" })
  }

  // --- Render ---

  if (loading) {
    return <div className="flex justify-center items-center h-[350px]">Loading data...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-[350px] text-red-500">{error}</div>
  }

  return (
    <div>
      {/* Selectors */}
      <div className="mb-4 flex gap-4">
        <div>
          <label htmlFor="dataType" className="mr-2">
            Data Type:
          </label>
          <select
            id="dataType"
            className="border rounded px-2 py-1"
            value={dataType}
            onChange={(e) => setDataType(e.target.value as DataType)}
          >
            <option value="visitors">Visitors</option>
            <option value="users">Users</option>
            <option value="comparison">Comparison</option>
          </select>
        </div>
        <div>
          <label htmlFor="timePeriod" className="mr-2">
            Time Period:
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
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={350}>
        {dataType === "comparison" ? (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="visitors" stroke="#004D4D" activeDot={{ r: 8 }} name="Unique Visitors" />
            <Line type="monotone" dataKey="users" stroke="#82ca9d" name="Users" />
          </LineChart>
        ) : (
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              formatter={(value) => [`${value} ${dataType === "visitors" ? "unique visitors" : "users"}`, "Total"]}
            />
            <Bar dataKey={dataType} fill="#004D4D" radius={[4, 4, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}
