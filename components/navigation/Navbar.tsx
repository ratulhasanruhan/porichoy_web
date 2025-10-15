"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useSupabase } from "@/components/providers/SupabaseProvider";
import {
  FileText,
  LogOut,
  Settings,
  Menu,
  X,
  Globe,
  LayoutDashboard,
  Edit3,
  ExternalLink,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getInitials } from "@/lib/utils";

export function Navbar() {
  const router = useRouter();
  const { user, profile, setProfile } = useAuthStore();
  const { supabase } = useSupabase();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState("bn");
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load locale from profile or localStorage
    const locale =
      profile?.locale || localStorage.getItem("preferredLocale") || "bn";
    setCurrentLocale(locale);
  }, [profile]);

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        langMenuRef.current &&
        !langMenuRef.current.contains(event.target as Node)
      ) {
        setLangMenuOpen(false);
      }
    };

    if (langMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [langMenuOpen]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleLanguageChange = async (newLocale: "bn" | "en") => {
    if (!user) {
      // For non-logged in users, store preference in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem("preferredLocale", newLocale);
      }
      setCurrentLocale(newLocale);
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
      return;
    }

    try {
      const { error } = await (supabase as any)
        .from("users")
        .update({ locale: newLocale })
        .eq("id", user.id);

      if (error) {
        console.error("Language change error:", error);
        return;
      }

      // Update local state
      if (profile) {
        setProfile({ ...profile, locale: newLocale });
      }
      setCurrentLocale(newLocale);

      // Reload to apply changes
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  return (
    <nav className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-lg font-bold">Porichoy</h1>
              <p className="text-xs text-muted-foreground font-bengali leading-none">
                পরিচয়
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/templates"
              className="text-sm hover:text-primary transition"
            >
              Templates
            </Link>

            {/* Language Switcher */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-2 text-sm hover:text-primary transition"
              >
                <Globe className="h-4 w-4" />
                <span>{currentLocale === "bn" ? "বাংলা" : "English"}</span>
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg border z-50">
                  <button
                    onClick={() => {
                      handleLanguageChange("bn");
                      setLangMenuOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 font-bengali ${
                      currentLocale === "bn" ? "bg-gray-100 dark:bg-gray-700" : ""
                    }`}
                  >
                    বাংলা
                  </button>
                  <button
                    onClick={() => {
                      handleLanguageChange("en");
                      setLangMenuOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      currentLocale === "en" ? "bg-gray-100 dark:bg-gray-700" : ""
                    }`}
                  >
                    English
                  </button>
                </div>
              )}
            </div>

            {user ? (
              <>
                {/* User Avatar Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="ml-2 h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium hover:bg-primary/20 transition-colors">
                      {profile?.name ? getInitials(profile.name) : "U"}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {profile?.name || "User"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard"
                        className="cursor-pointer"
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard/edit"
                        className="cursor-pointer"
                      >
                        <Edit3 className="mr-2 h-4 w-4" />
                        <span>Edit Resume</span>
                      </Link>
                    </DropdownMenuItem>
                    {profile?.username && (
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/${profile.username}`}
                          className="cursor-pointer"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          <span>View Profile</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard/settings"
                        className="cursor-pointer"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t">
            <Link
              href="/templates"
              className="block py-2 text-sm hover:text-primary transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Templates
            </Link>

            {/* Language Switcher Mobile */}
            <div className="py-2">
              <p className="text-xs text-muted-foreground mb-2">Language</p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    handleLanguageChange("bn");
                    setMobileMenuOpen(false);
                  }}
                  className={`flex-1 px-3 py-2 text-sm rounded ${
                    currentLocale === "bn"
                      ? "bg-primary text-primary-foreground"
                      : "bg-gray-100 dark:bg-gray-800"
                  } font-bengali`}
                >
                  বাংলা
                </button>
                <button
                  onClick={() => {
                    handleLanguageChange("en");
                    setMobileMenuOpen(false);
                  }}
                  className={`flex-1 px-3 py-2 text-sm rounded ${
                    currentLocale === "en"
                      ? "bg-primary text-primary-foreground"
                      : "bg-gray-100 dark:bg-gray-800"
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="block py-2 text-sm hover:text-primary transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/edit"
                  className="block py-2 text-sm hover:text-primary transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Editor
                </Link>
                {profile?.username && (
                  <Link
                    href={`/${profile.username}`}
                    className="block py-2 text-sm hover:text-primary transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    View Profile
                  </Link>
                )}
                <Link
                  href="/dashboard/settings"
                  className="block py-2 text-sm hover:text-primary transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block py-2 text-sm text-destructive hover:text-destructive/80 transition w-full text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="ghost" size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button size="sm" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
