"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  DollarSign,
  BarChart2,
  FileText,
  Settings,
  Megaphone,
  Activity,
  ShoppingCart,
  Bell,
  HelpCircle,
  LogOut,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ManagerNav() {
  const pathname = usePathname()

  return (
    <div className="h-screen w-64 border-r bg-white dark:bg-gray-950 flex flex-col">
      <div className="p-6">
        <h2 className="text-2xl font-bold tracking-tight">Lwie</h2>
        <p className="text-sm text-muted-foreground">Manager Dashboard</p>
      </div>

      <div className="flex flex-col h-full">
        <ScrollArea className="flex-1">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Dashboard</h2>
            <div className="space-y-1">
              <Button
                asChild
                variant={pathname === "/manager" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Link href="/manager">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Overview
                </Link>
              </Button>
              <Button
                asChild
                variant={pathname === "/manager/advertisements" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Link href="/manager/advertisements">
                  <Megaphone className="mr-2 h-4 w-4" />
                  Advertisements
                </Link>
              </Button>
              <Button
                asChild
                variant={pathname === "/manager/payments" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Link href="/manager/payments">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Payments
                </Link>
              </Button>
              <Button
                asChild
                variant={pathname === "/manager/analytics" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Link href="/manager/analytics">
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Analytics
                </Link>
              </Button>
              <Button
                asChild
                variant={pathname === "/manager/users" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Link href="/manager/users">
                  <Users className="mr-2 h-4 w-4" />
                  Users
                </Link>
              </Button>
              <Button
                asChild
                variant={pathname === "/manager/user-activity" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Link href="/manager/user-activity">
                  <Activity className="mr-2 h-4 w-4" />
                  User Activity
                </Link>
              </Button>
              <Button
                asChild
                variant={pathname === "/manager/reports" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Link href="/manager/reports">
                  <FileText className="mr-2 h-4 w-4" />
                  Reports
                </Link>
              </Button>
            </div>
          </div>
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Platform</h2>
            <div className="space-y-1">
              <Button
                asChild
                variant={pathname === "/manager/marketplace" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Link href="/manager/marketplace">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Marketplace
                </Link>
              </Button>
              <Button
                asChild
                variant={pathname === "/manager/notifications" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Link href="/manager/notifications">
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </Link>
              </Button>
            </div>
          </div>
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Account</h2>
            <div className="space-y-1">
              <Button
                asChild
                variant={pathname === "/manager/profile" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Link href="/manager/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </Button>
              <Button
                asChild
                variant={pathname === "/manager/settings" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Link href="/manager/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </Button>
              <Button
                asChild
                variant={pathname === "/manager/help" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Link href="/manager/help">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help & Support
                </Link>
              </Button>
            </div>
          </div>
        </ScrollArea>

        {/* Logout button fixed at bottom */}
        <div className="p-3 mt-auto border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            <Link href="/login" className="flex items-center w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

