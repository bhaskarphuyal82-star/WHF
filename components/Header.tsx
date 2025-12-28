"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, LogIn, Loader2, User, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ModeToggle } from "@/components/mode-toggle";

export default function Header() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [memberName, setMemberName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if member is logged in
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await fetch("/api/members/me");
        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(true);
          setMemberName(data.name || "");
        }
      } catch (error) {
        // Not logged in
      }
    };
    checkLogin();
  }, []);

  const navLinks = [
    { label: "गृहपृष्ठ", href: "/" },
    { label: "हाम्रो बारेमा", href: "/about" },
    { label: "कार्यक्रमहरू", href: "/programs" },
    { label: "गतिविधि", href: "/events" },
    { label: "सम्पर्क", href: "/contact" },
    { label: "सहयोग", href: "/donate" },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Try admin login first
      const adminResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (adminResponse.ok) {
        const data = await adminResponse.json();
        setIsLoginOpen(false);
        setEmail("");
        setPassword("");
        setRememberMe(false);
        router.push("/admin");
        router.refresh();
        return;
      }

      // Try member login
      const memberResponse = await fetch("/api/members/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const memberData = await memberResponse.json();

      if (memberResponse.ok) {
        setIsLoginOpen(false);
        setEmail("");
        setPassword("");
        setRememberMe(false);
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(memberData.error || "इमेल वा पासवर्ड गलत छ");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("एक त्रुटि भयो। कृपया पुनः प्रयास गर्नुहोस्।");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
        ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-2xl"
        : "bg-gradient-to-b from-black/50 to-transparent backdrop-blur-sm"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-orange-500/50 group-hover:ring-orange-400 transition-all duration-300">
              <Image
                src="/whf-logo.png"
                alt="World Hindu Federation Nepal"
                fill
                className="object-contain p-1"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-foreground font-bold text-lg leading-tight tracking-tight">
                विश्व हिन्दु महासंघ
              </span>
              <span className="text-orange-400 text-xs font-medium tracking-wider">
                नेपाल
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-muted-foreground hover:text-foreground font-medium text-sm transition-all duration-300 hover:bg-accent rounded-lg group relative"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 group-hover:w-3/4 transition-all duration-300" />
              </a>
            ))}
          </nav>

          {/* Login/Dashboard - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <ModeToggle />
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40">
                  <LayoutDashboard className="w-4 h-4" />
                  ड्यासबोर्ड
                </Button>
              </Link>
            ) : (
              <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                <DialogTrigger asChild>
                  <Button
                    suppressHydrationWarning
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40"
                  >
                    <LogIn className="w-4 h-4" />
                    लगइन
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border border-border">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-foreground">
                      स्वागत छ
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      आफ्नो खातामा प्रवेश गर्न लगइन गर्नुहोस्
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleLogin} className="space-y-4 mt-4">
                    {/* Error Message */}
                    {error && (
                      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
                        {error}
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground">
                        इमेल ठेगाना
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="bg-accent/50 border-input text-foreground placeholder-muted-foreground focus:ring-orange-500/50 focus:border-orange-500/50"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-foreground">
                        पासवर्ड
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="bg-accent/50 border-input text-foreground placeholder-muted-foreground focus:ring-orange-500/50 focus:border-orange-500/50"
                        required
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember"
                          checked={rememberMe}
                          onCheckedChange={(checked) =>
                            setRememberMe(checked as boolean)
                          }
                          className="border-input"
                        />
                        <Label
                          htmlFor="remember"
                          className="text-sm text-muted-foreground cursor-pointer"
                        >
                          मलाई सम्झनुहोस्
                        </Label>
                      </div>
                      <a
                        href="#forgot"
                        className="text-sm text-orange-400 hover:text-orange-300"
                      >
                        पासवर्ड भुल्नुभयो?
                      </a>
                    </div>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          लगइन हुँदै...
                        </>
                      ) : (
                        "लगइन गर्नुहोस्"
                      )}
                    </Button>
                    <p className="text-center text-sm text-muted-foreground">
                      खाता छैन?{" "}
                      <a
                        href="/register"
                        className="text-orange-400 hover:text-orange-300"
                      >
                        दर्ता गर्नुहोस्
                      </a>
                    </p>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Mobile Menu Sheet */}
          <div className="md:hidden flex items-center gap-2">
            <ModeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  suppressHydrationWarning
                  variant="ghost"
                  size="icon"
                  className="text-foreground hover:bg-accent"
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-background border-border">
                <SheetHeader>
                  <SheetTitle className="text-foreground">मेनु</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-2 mt-6">
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg font-medium transition-all"
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
                <div className="mt-6 pt-6 border-t border-border">
                  <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500">
                        <LogIn className="w-4 h-4" />
                        लगइन
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border border-border">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-foreground">
                          स्वागत छ
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                          आफ्नो खातामा प्रवेश गर्न लगइन गर्नुहोस्
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleLogin} className="space-y-4 mt-4">
                        {/* Error Message */}
                        {error && (
                          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
                            {error}
                          </div>
                        )}
                        <div className="space-y-2">
                          <Label htmlFor="email-mobile" className="text-foreground">
                            इमेल ठेगाना
                          </Label>
                          <Input
                            id="email-mobile"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="bg-accent/50 border-input text-foreground placeholder-muted-foreground focus:ring-orange-500/50 focus:border-orange-500/50"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password-mobile" className="text-foreground">
                            पासवर्ड
                          </Label>
                          <Input
                            id="password-mobile"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="bg-accent/50 border-input text-foreground placeholder-muted-foreground focus:ring-orange-500/50 focus:border-orange-500/50"
                            required
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="remember-mobile"
                              checked={rememberMe}
                              onCheckedChange={(checked) =>
                                setRememberMe(checked as boolean)
                              }
                              className="border-input"
                            />
                            <Label
                              htmlFor="remember-mobile"
                              className="text-sm text-muted-foreground cursor-pointer"
                            >
                              मलाई सम्झनुहोस्
                            </Label>
                          </div>
                          <a
                            href="#forgot"
                            className="text-sm text-orange-400 hover:text-orange-300"
                          >
                            पासवर्ड भुल्नुभयो?
                          </a>
                        </div>
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              लगइन हुँदै...
                            </>
                          ) : (
                            "लगइन गर्नुहोस्"
                          )}
                        </Button>
                        <p className="text-center text-sm text-muted-foreground">
                          खाता छैन?{" "}
                          <a
                            href="/register"
                            className="text-orange-400 hover:text-orange-300"
                          >
                            दर्ता गर्नुहोस्
                          </a>
                        </p>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
