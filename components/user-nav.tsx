"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Cookies from "js-cookie"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getUserCookie } from "@/lib/cookies"

export function UserNav() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any | null>(null)

  useEffect(() => {
    const userData = getUserCookie()
    setUser(userData)
  }, [])

  // Determine if we're in the admin or manager section
  const isAdmin = pathname.startsWith("/admin")
  const profilePath = isAdmin ? "/admin/profile" : "/manager/profile"
  const settingsPath = isAdmin ? "/admin/settings" : "/manager/settings"

  const getUserInitials = () => {
    if (!user) return "Loading..."
    return `${user.Firstname ? user.Firstname.charAt(0).toUpperCase() : ''}${user.lastname ? user.lastname.charAt(0).toUpperCase() : ''}`
  }

  const userName = user ? `${user.Firstname} ${user.lastname}` : "Loading..."
  const userEmail = user ? user.Email : "Loading..."
  const userAvatar = user ? user.Image || "/placeholder.svg?height=32&width=32" : "/placeholder.svg?height=32&width=32"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userAvatar} alt="User avatar" className="object-cover" />
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push(profilePath)}>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(settingsPath)}>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => {
          router.push("/login")
          Cookies.remove('user')
          }}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}