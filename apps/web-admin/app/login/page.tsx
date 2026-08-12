"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://hitro-logistics.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        document.cookie = "isLoggedIn=true; path=/; max-age=86400"; // Set cookie for middleware
        toast.success("Login successful!");
        router.push("/");
      } else {
        toast.error("Invalid credentials.");
      }
    } catch (error) {
      toast.error("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full font-sans bg-slate-50">
      {/* Left side - Dark Theme Hero */}
      <div className="hidden lg:flex flex-col w-1/2 bg-[#1E293B] text-white p-12 relative overflow-hidden">
        
        {/* Subtle Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F97316] opacity-10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 opacity-10 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3" />

        <div className="relative z-10 flex">
          <div className="bg-white/95 backdrop-blur px-5 py-3 rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.2)]">
            <Image src="/logo.png" alt="HITRO LOGISTICS" width={200} height={48} className="h-10 w-auto object-contain mix-blend-multiply" />
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-xl relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 tracking-tight text-white">
            Intelligent Transport Management for Hitro Fleet
          </h1>
          <p className="text-[#94A3B8] text-lg mb-12 font-medium leading-relaxed">
            Streamline your logistics, track shipments in real-time, and manage your entire fleet operations from a single unified platform.
          </p>
          <div className="flex items-center gap-4 text-sm font-medium text-gray-300">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#1E293B] bg-gray-700 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800" />
                </div>
              ))}
            </div>
            <span>Trusted by 500+ transport companies</span>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white text-ink">
        <div className="mx-auto w-full max-w-sm lg:w-[400px]">
          <div className="text-center lg:text-left mb-10">
            <div className="lg:hidden flex items-center justify-center h-24 mb-8">
              <Image src="/logo.png" alt="HITRO LOGISTICS" width={200} height={96} className="h-full w-auto max-w-[200px] object-contain mix-blend-multiply" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-600">
              Enter your credentials to access your dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email address</Label>
              <div className="relative">
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@example.com"
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-4 py-3 text-[15px] border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] outline-none transition-all text-slate-700 bg-slate-50/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
                <Link href="#" className="text-sm font-medium text-[#F97316] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input 
                  id="password" 
                  type="password"
                  placeholder="••••••••"
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-4 py-3 text-[15px] border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] outline-none transition-all text-slate-700 bg-slate-50/50"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#F97316] hover:bg-[#ea580c] text-white font-bold py-3.5 px-4 rounded-xl shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:ring-offset-2 disabled:opacity-70 text-[15px]"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : "Sign in to Dashboard"}
            </button>
          </form>

          <div className="mt-8 text-center text-[14px] text-slate-500 font-medium">
            Don&apos;t have an account?{" "}
            <Link href="#" className="text-[#F97316] font-semibold hover:underline">
              Request access
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
