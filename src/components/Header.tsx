'use client';

import Link from 'next/link';
import { Code, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { navLinks } from '@/lib/data';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { cn } from '@/lib/utils';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
      href={href}
      className="text-muted-foreground transition-colors hover:text-foreground"
      onClick={() => setIsMenuOpen(false)}
    >
      {children}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Code className="h-6 w-6 text-primary" />
          <span className="font-bold text-primary-gradient">Chancellor Minus</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href}>{link.name}</NavLink>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end gap-4">
           <Button asChild className="hidden sm:inline-flex bg-primary-gradient">
            <Link href="#">Admin Login</Link>
          </Button>
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="p-4">
                <Link href="/" className="mb-8 flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
                  <Code className="h-6 w-6 text-primary" />
                  <span className="font-bold">Chancellor Minus</span>
                </Link>
                <nav className="flex flex-col gap-6 text-lg">
                    {navLinks.map((link) => (
                        <NavLink key={link.href} href={link.href}>{link.name}</NavLink>
                    ))}
                </nav>
                 <Button asChild className="w-full mt-8 bg-primary-gradient">
                    <Link href="#">Admin Login</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
