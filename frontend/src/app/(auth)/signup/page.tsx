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

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedRole = watch("role");

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    try {
      const payload = {
        name: data.fullName,
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        role: data.role,
      };
      const response = await apiClient.post("/auth/register", payload);
      const { token, _id, name, fullName: returnedFullName, email, role } = response.data;
      const user = { _id, fullName: returnedFullName || name || data.fullName, email, role } as User;
      
      login(token, user);
      toast.success("Account created successfully!");
      
      if (user.role === 'owner') {
        router.push('/owner/dashboard');
      } else {
        router.push('/borrower/dashboard');
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string | string[] } } };
      const rawMsg = err.response?.data?.message;
      const msg = Array.isArray(rawMsg)
        ? rawMsg.join(', ')
        : rawMsg || "Failed to create account";
      toast.error(msg);
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
          <h1 className="text-3xl font-heading font-medium tracking-tight mb-2">Create Account</h1>
          <p className="text-sm text-muted-foreground">Join the community</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground block mb-2" htmlFor="fullName">
              Full Name
            </label>
            <Input
              id="fullName"
              type="text"
              placeholder="Full Name"
              className="bg-secondary border-border px-4 py-4 h-auto text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all rounded-md"
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-xs text-destructive">{errors.fullName.message}</p>
            )}
          </div>

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
            <label className="text-xs font-semibold text-muted-foreground block mb-2" htmlFor="password">
              Password
            </label>
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

          <div className="space-y-3 pt-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-forest-light-sage block mb-2">
              I want to...
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setValue("role", "borrower")}
                className={`py-3 px-4 rounded-md text-xs uppercase font-semibold transition-all ${
                  selectedRole === "borrower"
                    ? "bg-primary text-primary-foreground border border-primary shadow-sm"
                    : "bg-secondary border border-border text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                Rent Items
              </button>
              <button
                type="button"
                onClick={() => setValue("role", "owner")}
                className={`py-3 px-4 rounded-md text-xs uppercase font-semibold transition-all ${
                  selectedRole === "owner"
                    ? "bg-primary text-primary-foreground border border-primary shadow-sm"
                    : "bg-secondary border border-border text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                List Items
              </button>
            </div>
            {errors.role && (
              <p className="text-xs text-destructive">{errors.role.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full h-12 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 mt-8 shadow-sm transition-all" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-foreground hover:text-primary transition-colors font-semibold">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
