import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const cookies = request.cookies

  // Get auth token and user role from cookies
  const authToken = cookies.get("authToken")?.value
  const userRole = cookies.get("userRole")?.value

  // Redirect root to admin dashboard by default if authenticated
  if (pathname === "/") {
    if (!authToken) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    if (userRole === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url))
    } else if (userRole === "manager") {
      return NextResponse.redirect(new URL("/manager", request.url))
    } else {
      // If role is unknown but authenticated, default to login
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Handle access control for admin routes
  if (pathname.startsWith("/admin")) {
    // If not authenticated, redirect to login
    if (!authToken) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // If not admin, redirect to unauthorized
    if (userRole !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }
  }

  // Handle access control for manager routes
  if (pathname.startsWith("/manager")) {
    // If not authenticated, redirect to login
    if (!authToken) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // If not manager, redirect to unauthorized
    if (userRole !== "manager") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }
  }

  // Redirect removed pages (from previous requirements)
  if (pathname === "/admin/purchase-order" || pathname === "/admin/template/measurement") {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/admin/:path*", "/manager/:path*", "/admin/purchase-order", "/admin/template/measurement"],
}

