import type React from "react"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserNav } from "@/components/user-nav"
import NotificationsPage from "./notification/page"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <MainNav />
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-14 border-b bg-white dark:bg-gray-950 flex items-center px-4 justify-between sticky top-0 z-10">
          <Search />
          {/* <div className="mt-6">
          <NotificationsPage />

          </div> */}
          <NotificationsPage/>
          <UserNav />
        </header>
        <main className="flex-1 p-4 overflow-auto bg-[#e5eded] dark:bg-gray-900">{children}</main>
      </div>
    </div>
  )
}

