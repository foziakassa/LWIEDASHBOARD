"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, ArrowLeft, CheckCircle2, Lock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const email = searchParams.get("email")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  // Check if token is valid
  if (!token || !email) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#e5eded] dark:bg-gray-900 p-4">
        <div className="w-full max-w-md space-y-8">
          <Card className="w-full shadow-lg border-0">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl">Invalid Reset Link</CardTitle>
              <CardDescription>The password reset link is invalid or has expired.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-lg font-medium">Link Not Valid</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-xs">
                  Please request a new password reset link from the forgot password page.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/forgot-password">Request New Link</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  const calculatePasswordStrength = (password: string) => {
    let strength = 0

    // Length check
    if (password.length >= 8) strength += 25

    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 25

    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 25

    // Contains number or special char
    if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 25

    setPasswordStrength(strength)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Validate password
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters")
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match")
      }

      if (passwordStrength < 75) {
        throw new Error("Please choose a stronger password")
      }

      // In a real app, this would be an API call to reset the password
      // For demo purposes, we'll simulate the process
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSuccess(true)

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#e5eded] dark:bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 h-12 w-12 rounded-full bg-primary flex items-center justify-center">
            <span className="text-xl font-bold text-white">L</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Lwie Platform</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Create a new password</p>
        </div>

        <Card className="w-full shadow-lg border-0">
          <CardHeader className="space-y-1">
            <div className="flex items-center">
              <Link href="/login" className="mr-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <CardTitle className="text-xl">Reset Password</CardTitle>
            </div>
            <CardDescription>Create a new password for your account</CardDescription>
          </CardHeader>

          {success ? (
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-medium">Password Reset Successful</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-xs">
                  Your password has been reset successfully. You will be redirected to the login page in a few seconds.
                </p>
              </div>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-1">
                  <p className="text-sm">
                    Resetting password for: <strong>{email}</strong>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter new password"
                      className="pl-10"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        calculatePasswordStrength(e.target.value)
                      }}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Progress value={passwordStrength} className="h-1" />
                    <p className="text-xs text-muted-foreground">
                      {passwordStrength === 0 && "Enter a password"}
                      {passwordStrength === 25 && "Weak password"}
                      {passwordStrength === 50 && "Fair password"}
                      {passwordStrength === 75 && "Good password"}
                      {passwordStrength === 100 && "Strong password"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm new password"
                      className="pl-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Resetting password...
                    </span>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>

        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Remember your password?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

