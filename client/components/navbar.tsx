"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAlert } from "@/lib/alert-context";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { showAlert } = useAlert();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.href = "/"; // full reload
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold">
            Recipe App
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              className={`hover:text-primary ${
                pathname === "/" ? "text-primary font-medium" : ""
              }`}
            >
              Search
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  href="/saved-recipes"
                  className={`hover:text-primary ${
                    pathname === "/saved-recipes"
                      ? "text-primary font-medium"
                      : ""
                  }`}
                >
                  Saved Recipes
                </Link>
                <Button variant="ghost" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`hover:text-primary ${
                    pathname === "/login" ? "text-primary font-medium" : ""
                  }`}
                >
                  Login
                </Link>
                <Link href="/register">
                  <Button variant="default">Register</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3">
            <Link
              href="/"
              className={`block py-2 hover:text-primary ${
                pathname === "/" ? "text-primary font-medium" : ""
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Search
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  href="/saved-recipes"
                  className={`block py-2 hover:text-primary ${
                    pathname === "/saved-recipes"
                      ? "text-primary font-medium"
                      : ""
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Saved Recipes
                </Link>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`block py-2 hover:text-primary ${
                    pathname === "/login" ? "text-primary font-medium" : ""
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="default" className="w-full">
                    Register
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
