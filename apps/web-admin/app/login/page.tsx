"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Truck } from "lucide-react";
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
      const response = await fetch("http://localhost:5063/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
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
    <div className="flex min-h-screen bg-white">
      {/* Left side - Branding & Design */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0B1120] text-white flex-col justify-between p-12 overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-600/20 blur-[120px]" />
          <div className="absolute top-[40%] right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[100px]" />
        </div>

        <div className="relative z-10 flex items-center gap-3 font-disp font-bold text-xl tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
            <Truck className="w-5 h-5 text-white" />
          </div>
          RouteLedger TMS
        </div>

        <div className="relative z-10 max-w-lg mt-auto">
          <h1 className="font-disp text-4xl font-bold leading-tight mb-6">
            Intelligent Transport Management for Modern Fleets
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Streamline your logistics, track shipments in real-time, and manage your entire fleet operations from a single unified platform.
          </p>
          <div className="flex items-center gap-4 text-sm font-medium text-gray-300">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0B1120] bg-gray-700 flex items-center justify-center overflow-hidden">
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
            <div className="lg:hidden flex items-center justify-center gap-3 font-disp font-bold text-xl tracking-tight mb-8 text-black">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              RouteLedger TMS
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 font-disp">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your credentials to access your dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email address</Label>
              <div className="relative">
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@routeledger.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-6 bg-gray-50 border-gray-200 focus:bg-white transition-colors text-black placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Input 
                  id="password" 
                  type="password"
                  placeholder="••••••••"
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-6 bg-gray-50 border-gray-200 focus:bg-white transition-colors text-black placeholder:text-gray-400"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full py-6 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-all hover:shadow-md"
            >
              {loading ? "Signing in..." : "Sign in to Dashboard"}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
              Request access
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
