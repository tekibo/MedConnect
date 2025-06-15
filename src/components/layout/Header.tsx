
"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, MessageCircle, UserCircle, Video, CalendarDays, Search, HomeIcon, Stethoscope } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from 'react';

const navItems = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/symptoms', label: 'Check Symptoms', icon: Search },
  { href: '/doctors', label: 'Find Doctors', icon: Stethoscope },
  { href: '/bookings', label: 'My Bookings', icon: CalendarDays },
];

export default function Header() {
  // Simplified auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Hydration safety for auth state
  useEffect(() => {
    // In a real app, check actual auth status, e.g., from localStorage or a context
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, []);


  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <UserCircle className="h-6 w-6" />
          <span className="sr-only">User Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/bookings">My Bookings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => {
          localStorage.removeItem("isLoggedIn");
          setIsLoggedIn(false);
          // redirect or refresh might be needed
        }}>
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <MessageCircle className="h-8 w-8 text-primary" />
          <span className="font-headline text-2xl font-bold text-primary">SwasthyaSetu</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="transition-colors hover:text-primary">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-2">
          {isLoggedIn ? (
            <UserMenu />
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </>
          )}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="grid gap-6 text-lg font-medium mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center space-x-2 transition-colors hover:text-primary"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
