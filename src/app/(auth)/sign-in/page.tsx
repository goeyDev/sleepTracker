import { SignInForm } from "@/auth/nextjs/components/SignInForm"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{ oauthError?: string }>
}) {
  const { oauthError } = await searchParams

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-r from-purple-500  to-green-100 bg-opacity-50 flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          {oauthError && (
            <CardDescription className="text-destructive">
              {oauthError}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
      </Card>
    </div>
  )
}