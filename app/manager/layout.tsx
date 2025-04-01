import type React from "react"
import { ManagerNav } from "@/components/manager/manager-nav"
import { Search } from "@/components/search"
import { UserNav } from "@/components/user-nav"
import { ModeToggle } from "@/components/theme/mode-toggle"

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <ManagerNav />
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-14 border-b bg-white dark:bg-gray-950 flex items-center px-4 justify-between sticky top-0 z-10">
          <Search />
          <div className="flex items-center gap-4">
            <ModeToggle />
            <UserNav />
          </div>
        </header>
        <main className="flex-1 p-4 overflow-auto bg-[#e5f5f5] dark:bg-gray-900">{children}</main>
      </div>
    </div>
  )
}

