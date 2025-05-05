import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="rounded-lg border bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
