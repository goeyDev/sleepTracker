import { SignUpForm } from "@/auth/nextjs/components/SignUpForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignUp() {
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-r from-purple-500  to-green-100 bg-opacity-50 flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>SignUp</CardTitle>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
}
