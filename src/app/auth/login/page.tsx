
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldQuestion } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation or actual login logic here
    if (email && password) {
      // Simulate login
      localStorage.setItem("isLoggedIn", "true");
      router.push('/'); // Redirect to home or dashboard
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <ShieldQuestion className="mx-auto h-16 w-16 text-primary mb-4" />
          <CardTitle className="text-3xl">Welcome Back!</CardTitle>
          <CardDescription>Log in to access your SwasthyaSetu account.</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="you@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" required value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full text-lg py-3 shadow-md hover:shadow-lg">
              Log In
            </Button>
          </CardContent>
        </form>
        <CardFooter className="flex flex-col items-center space-y-3">
          <Button variant="link" className="text-sm" asChild>
            <Link href="/auth/forgot-password">Forgot Password?</Link>
          </Button>
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="font-semibold text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
