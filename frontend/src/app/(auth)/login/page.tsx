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
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to log in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md p-8 sm:p-12 border border-border bg-card">
        <div className="mb-10">
          <h1 className="text-2xl font-light tracking-tight mb-2">Welcome Back</h1>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Log in to your RENTABLE account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2" htmlFor="email">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="bg-transparent rounded-none border-0 border-b border-border px-0 py-2 h-auto focus-visible:ring-0 focus-visible:border-foreground"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground" htmlFor="password">
                Password
              </label>
              <Link href="#" className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="bg-transparent rounded-none border-0 border-b border-border px-0 py-2 h-auto focus-visible:ring-0 focus-visible:border-foreground"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full h-12 rounded-sm bg-foreground text-background uppercase tracking-widest text-xs hover:bg-foreground/90 mt-8" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-8 text-xs text-muted-foreground uppercase tracking-widest">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-foreground hover:underline ml-1">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
