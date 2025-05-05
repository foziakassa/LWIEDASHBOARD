import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"

export type UserData = {
  id: number
  Firstname: string
  Lastname: string
  Email: string
  IsAdmin: boolean
  Role: string
  Image: string | null
}

export function setUserCookie(userData: UserData): void {
  // In client components, we need to use document.cookie
  if (typeof window !== "undefined") {
    // Encode the user data as JSON and then as URI component to avoid issues with special characters
    const encodedUserData = encodeURIComponent(JSON.stringify(userData))

    // Set cookie to expire in 7 days
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 7)

    document.cookie = `user=${encodedUserData}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`
  }
}

export function getUserCookie(): UserData | null {
  if (typeof window !== "undefined") {
    const cookies = document.cookie.split(";")
    const userCookie = cookies.find((cookie) => cookie.trim().startsWith("user="))

    if (userCookie) {
      try {
        const encodedUserData = userCookie.split("=")[1].trim()
        return JSON.parse(decodeURIComponent(encodedUserData))
      } catch (error) {
        console.error("Error parsing user cookie:", error)
        return null
      }
    }
  }
  return null
}

export function clearUserCookie(): void {
  if (typeof window !== "undefined") {
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict"
  }
}

// Server-side cookie functions
export function getServerUserCookie(cookieStore: ReadonlyRequestCookies): UserData | null {
  const userCookie = cookieStore.get("user")

  if (userCookie) {
    try {
      return JSON.parse(decodeURIComponent(userCookie.value))
    } catch (error) {
      console.error("Error parsing user cookie:", error)
      return null
    }
  }

  return null
}
