"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["borrower", "owner"]),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: "borrower",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post("/auth/register", data);
      const { token, _id, name, email, role } = response.data;
      const user = { _id, fullName: name, email, role } as User;
      
      login(token, user);
      toast.success("Account created successfully!");
      
      if (user.role === 'owner') {
        router.push('/owner/dashboard');
      } else {
        router.push('/borrower/dashboard');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md p-8 sm:p-12 border border-border bg-card">
        <div className="mb-10">
          <h1 className="text-2xl font-light tracking-tight mb-2">Create Account</h1>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Join RENTABLE today</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2" htmlFor="fullName">
              Full Name
            </label>
            <Input
              id="fullName"
              type="text"
              placeholder="Full Name"
              className="bg-transparent rounded-none border-0 border-b border-border px-0 py-2 h-auto focus-visible:ring-0 focus-visible:border-foreground"
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-xs text-red-500">{errors.fullName.message}</p>
            )}
          </div>

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
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2" htmlFor="password">
              Password
            </label>
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

          <div className="space-y-3 pt-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">
              I want to...
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setValue("role", "borrower")}
                className={`py-3 px-4 border text-xs uppercase tracking-widest transition-all ${
                  selectedRole === "borrower"
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground"
                }`}
              >
                Rent Items
              </button>
              <button
                type="button"
                onClick={() => setValue("role", "owner")}
                className={`py-3 px-4 border text-xs uppercase tracking-widest transition-all ${
                  selectedRole === "owner"
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground"
                }`}
              >
                List Items
              </button>
            </div>
            {errors.role && (
              <p className="text-xs text-red-500">{errors.role.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full h-12 rounded-sm bg-foreground text-background uppercase tracking-widest text-xs hover:bg-foreground/90 mt-8" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <div className="mt-8 text-xs text-muted-foreground uppercase tracking-widest">
          Already have an account?{" "}
          <Link href="/login" className="text-foreground hover:underline ml-1">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
