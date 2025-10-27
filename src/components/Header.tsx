'use client';

import Link from 'next/link';
import { Code, Menu, User, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { navLinks } from '@/lib/data';
import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { ModeToggle } from './ModeToggle';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
    }
  };

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
      href={href}
      className="text-muted-foreground transition-colors hover:text-foreground"
      onClick={() => setIsMenuOpen(false)}
    >
      {children}
    </Link>
  );

  const AuthButtons = () => {
    if (isUserLoading) {
      return null;
    }
    if (user) {
      return (
        <>
          <Button asChild variant="ghost" size="icon">
            <Link href="/profile">
              <User />
              <span className="sr-only">Profile</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <LogOut />
            <span className="sr-only">Sign Out</span>
          </Button>
        </>
      );
    }
    return (
      <Button asChild className="bg-primary-gradient">
        <Link href="/login">Login</Link>
      </Button>
    );
  };

  const MobileAuthButtons = () => {
     if (isUserLoading) {
      return null;
    }
    if (user) {
      return (
         <div className='flex flex-col gap-2'>
            <Button asChild className="w-full">
              <Link href="/profile">Profile</Link>
            </Button>
            <Button onClick={handleSignOut} variant='outline' className="w-full">
                Sign Out
            </Button>
        </div>
      );
    }
    return (
       <Button asChild className="w-full mt-8 bg-primary-gradient">
          <Link href="/login">Login</Link>
      </Button>
    )
  }

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
        <div className="flex flex-1 items-center justify-end gap-2">
            <ModeToggle />
           <div className="hidden sm:inline-flex gap-2">
            <AuthButtons />
          </div>
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
              </SheetHeader>
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
                <div className="mt-8">
                  <MobileAuthButtons />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
