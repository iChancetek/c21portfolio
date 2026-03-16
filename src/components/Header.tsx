
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Code, Menu, User, LogOut, Briefcase, LayoutDashboard, Shield, Heart, Settings as SettingsIcon, Star, Bot, FileText, ChevronDown, Activity, Stethoscope, Users, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { ModeToggle } from './ModeToggle';
import { useAdmin } from '@/hooks/useAdmin';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import SettingsDialog from './SettingsDialog';
import { useLocale } from '@/hooks/useLocale';


export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isUserLoading } = useUser();
  const { isAdmin } = useAdmin();
  const auth = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const router = useRouter();
  const { t } = useLocale();

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
    }
  };

  const NavLink = ({ href, children, isProjectLink = false }: { href: string; children: React.ReactNode; isProjectLink?: boolean }) => (
    <Link
      href={href}
      className={`transition-colors hover:text-foreground ${isProjectLink ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
               <Avatar className="h-8 w-8 sm:hidden">
                  <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                  <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline-block">{user.displayName || user.email}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{t('myAccount')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/profile')}>
              <User className="mr-2 h-4 w-4" />
              <span>{t('profile')}</span>
            </DropdownMenuItem>
             <DropdownMenuItem onClick={() => router.push('/profile?tab=favorites')}>
                <Star className="mr-2 h-4 w-4" />
                <span>{t('myFavorites')}</span>
            </DropdownMenuItem>
             <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
              <SettingsIcon className="mr-2 h-4 w-4" />
              <span>{t('settings')}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t('logOut')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    return (
      <Button asChild className="bg-primary-gradient">
        <Link href="/login">{t('login')}</Link>
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
              <Link href="/profile">{t('profile')}</Link>
            </Button>
             <Button onClick={() => { setIsSettingsOpen(true); setIsMenuOpen(false); }} variant='outline' className="w-full">
                {t('settings')}
            </Button>
            <Button onClick={handleSignOut} variant='outline' className="w-full">
                {t('logOut')}
            </Button>
        </div>
      );
    }
    return (
       <Button asChild className="w-full mt-8 bg-primary-gradient">
          <Link href="/login">{t('login')}</Link>
      </Button>
    )
  }

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Image src="/scripted-logo.png" alt="Chancellor Minus Logo" width={56} height={56} className="h-14 w-auto rounded-md" />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <NavLink href="/projects" isProjectLink>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              {t('projects')}
            </div>
          </NavLink>
           <NavLink href="/ai-agents" isProjectLink>
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              AI Agents
            </div>
          </NavLink>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant="ghost" className="p-0 h-auto font-semibold text-foreground text-sm flex items-center gap-1 hover:text-foreground/80 focus-visible:ring-0">
                <Star className="h-4 w-4" />
                Featured Platforms
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <a href="https://StrideIQ.fit/" target="_blank" rel="noopener noreferrer" className="cursor-pointer flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" /> StrideIQ
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="https://iCareOS.tech/" target="_blank" rel="noopener noreferrer" className="cursor-pointer flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-primary" /> iCareOS
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="https://Famio.us/" target="_blank" rel="noopener noreferrer" className="cursor-pointer flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" /> Famio
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="https://eVolvable.us/" target="_blank" rel="noopener noreferrer" className="cursor-pointer flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" /> Evolvable
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant="ghost" className="p-0 h-auto font-semibold text-foreground text-sm flex items-center gap-1 hover:text-foreground/80 focus-visible:ring-0">
                <FileText className="h-4 w-4" />
                Resume / CV
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => router.push('/resume')}>
                Resume
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/cv')}>
                CV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <NavLink href="/projects#skills" isProjectLink>{t('skills')}</NavLink>
          <NavLink href="/projects#contact" isProjectLink>{t('contact')}</NavLink>
          <NavLink href="/affirmations" isProjectLink>{t('affirmations')}</NavLink>
          {user && (
            <>
             <NavLink href="/dashboard" isProjectLink>
                <div className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    {t('techInsight')}
                </div>
             </NavLink>
             <NavLink href="/healthy-living" isProjectLink>
                <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    {t('healthyLiving')}
                </div>
             </NavLink>
            </>
          )}
          {isAdmin && (
             <NavLink href="/admin" isProjectLink>
                <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Admin
                </div>
             </NavLink>
          )}
        </nav>
        <div className="flex flex-1 items-center justify-end gap-2">
            <ModeToggle />
           <div className="inline-flex gap-2">
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
                  <Image src="/scripted-logo.png" alt="Chancellor Minus Logo" width={56} height={56} className="h-14 w-auto rounded-md" />
                </Link>
                <nav className="flex flex-col gap-6 text-lg">
                    <NavLink href="/projects" isProjectLink>{t('projects')}</NavLink>
                    <NavLink href="/ai-agents" isProjectLink>AI Agents</NavLink>
                    <div className="flex flex-col gap-4 pl-4 border-l-2 border-primary/20">
                      <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Featured Platforms</span>
                      <a href="https://StrideIQ.fit/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-base font-semibold text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                        <Activity className="h-4 w-4 text-primary" /> StrideIQ
                      </a>
                      <a href="https://iCareOS.tech/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-base font-semibold text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                        <Stethoscope className="h-4 w-4 text-primary" /> iCareOS
                      </a>
                      <a href="https://Famio.us/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-base font-semibold text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                        <Users className="h-4 w-4 text-primary" /> Famio
                      </a>
                      <a href="https://eVolvable.us/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-base font-semibold text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                        <Sparkles className="h-4 w-4 text-primary" /> Evolvable
                      </a>
                    </div>
                    <NavLink href="/resume" isProjectLink>Resume</NavLink>
                    <NavLink href="/cv" isProjectLink>CV</NavLink>
                    <NavLink href="/projects#skills" isProjectLink>{t('skills')}</NavLink>
                    <NavLink href="/projects#contact" isProjectLink>{t('contact')}</NavLink>
                    <NavLink href="/affirmations" isProjectLink>{t('affirmations')}</NavLink>
                     {user && (
                        <>
                          <NavLink href="/dashboard" isProjectLink>{t('techInsight')}</NavLink>
                          <NavLink href="/healthy-living" isProjectLink>{t('healthyLiving')}</NavLink>
                        </>
                     )}
                     {isAdmin && (
                        <NavLink href="/admin" isProjectLink>Admin</NavLink>
                     )}
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
    {user && <SettingsDialog isOpen={isSettingsOpen} onOpenChange={setIsSettingsOpen} />}
    </>
  );
}
