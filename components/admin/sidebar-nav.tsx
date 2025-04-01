"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  BarChart2,
  ShieldAlert,
  MessageSquare,
  ArrowLeftRight,
  Package,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export function AdminSidebarNav() {
  const pathname = usePathname()

  return (
    <ScrollArea className="h-full py-6">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Admin Dashboard</h2>
        <div className="space-y-1">
          <Button asChild variant={pathname === "/admin" ? "secondary" : "ghost"} className="w-full justify-start">
            <Link href="/admin">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Overview
            </Link>
          </Button>
          <Button
            asChild
            variant={pathname === "/admin/analytics" ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <Link href="/admin/analytics">
              <BarChart2 className="mr-2 h-4 w-4" />
              Analytics
            </Link>
          </Button>
          <Button
            asChild
            variant={pathname === "/admin/users" ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <Link href="/admin/users">
              <Users className="mr-2 h-4 w-4" />
              Users
            </Link>
          </Button>
          <Button
            asChild
            variant={pathname === "/admin/items" ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <Link href="/admin/items">
              <Package className="mr-2 h-4 w-4" />
              Items
            </Link>
          </Button>
          <Button
            asChild
            variant={pathname === "/admin/templates" ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <Link href="/admin/templates">
              <FileText className="mr-2 h-4 w-4" />
              Templates
            </Link>
          </Button>
          <Button
            asChild
            variant={pathname === "/admin/moderation" ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <Link href="/admin/moderation">
              <MessageSquare className="mr-2 h-4 w-4" />
              Moderation
            </Link>
          </Button>
          <Button
            asChild
            variant={pathname === "/admin/swaps" ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <Link href="/admin/swaps">
              <ArrowLeftRight className="mr-2 h-4 w-4" />
              Swaps
            </Link>
          </Button>
          <Button
            asChild
            variant={pathname === "/admin/security" ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <Link href="/admin/security">
              <ShieldAlert className="mr-2 h-4 w-4" />
              Security
            </Link>
          </Button>
        </div>
      </div>
    </ScrollArea>
  )
}

