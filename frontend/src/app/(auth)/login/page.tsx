"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth/AuthContext";
import apiClient from "@/lib/api/client";
import { User } from "@/types/user";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post("/auth/login", data);
      const { token, _id, name, email, role } = response.data;
      const user = { _id, fullName: name, email, role } as User;
      
      login(token, user);
      toast.success("Successfully logged in!");
      
      // Redirect based on role or returnUrl
      const returnUrl = searchParams.get("returnUrl");
      if (returnUrl) {
        router.push(returnUrl);
      } else {
        if (user.role === 'admin') router.push('/admin/dashboard');
        else if (user.role === 'owner') router.push('/owner/dashboard');
        else router.push('/borrower/dashboard');
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed to log in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 py-12 bg-background">
      <div className="w-full max-w-md relative z-10 bg-card rounded-3xl p-8 sm:p-12 shadow-sm border border-border text-foreground">
        <div className="mb-10 text-center">
          <Link href="/" className="inline-block mb-6">
            <span className="text-xl font-heading font-bold tracking-widest text-primary uppercase">Rentable</span>
          </Link>
          <h1 className="text-3xl font-heading font-medium tracking-tight mb-2">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">Log in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground block mb-2" htmlFor="email">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="bg-secondary border-border px-4 py-4 h-auto text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all rounded-md"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-muted-foreground" htmlFor="password">
                Password
              </label>
              <Link href="#" className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="bg-secondary border-border px-4 py-4 h-auto text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all rounded-md"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full h-12 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 mt-8 shadow-sm transition-all" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-foreground hover:text-primary transition-colors font-semibold">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-foreground bg-background">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
