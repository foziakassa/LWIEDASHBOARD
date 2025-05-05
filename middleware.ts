import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the user cookie
  const userCookie = request.cookies.get("user")

  // Check if the path starts with /admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // If no user cookie exists, redirect to login
    if (!userCookie) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    try {
      // Parse the user data
      const userData = JSON.parse(decodeURIComponent(userCookie.value))

      // Check if user has Admin or Manager role
      if (userData.Role !== "Admin" && userData.Role !== "Manager") {
        return NextResponse.redirect(new URL("/login", request.url))
      }
    } catch (error) {
      // If there's an error parsing the cookie, redirect to login
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ["/admin/:path*"],
}
