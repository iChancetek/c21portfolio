'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword, AuthError, GoogleAuthProvider, signInWithPopup, UserCredential } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { logAuditEvent } from '@/app/actions';
import { useLocale } from '@/hooks/useLocale';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.36 1.67-4.06 1.67-3.4 0-6.17-2.83-6.17-6.23s2.77-6.23 6.17-6.23c1.6 0 2.86.66 3.79 1.48l2.84-2.76C18.6 1.9 15.82 0 12.48 0 5.6 0 0 5.6 0 12.48s5.6 12.48 12.48 12.48c7.2 0 12.04-4.76 12.04-12.24 0-.76-.07-1.5-.18-2.22H12.48z"
    />
  </svg>
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLocale();
  
  const anyLoading = isLoading || isGoogleLoading;

  const handleSuccessfulLogin = (userCredential: UserCredential) => {
    const user = userCredential.user;
    logAuditEvent({
        eventType: 'USER_LOGIN',
        actor: { uid: user.uid, email: user.email || 'N/A' },
        details: `User logged in via ${userCredential.providerId || 'email'}.`
    });
    toast({ title: t('success'), description: t('login') });
    router.push('/dashboard');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setIsLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      handleSuccessfulLogin(userCredential);
    } catch (err) {
      const error = err as AuthError;
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    if (!auth) return;
    setIsGoogleLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      const userCredential = await signInWithPopup(auth, provider);
      handleSuccessfulLogin(userCredential);
    } catch (err) {
      const error = err as AuthError;
      setError(error.message);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-150px)] py-12 px-4">
      <Card className="w-full max-w-md bg-black/30 backdrop-blur-sm border-white/10 shadow-2xl shadow-primary/10">
        <CardHeader className="text-center">
          <h1 className="text-3xl font-bold tracking-tighter mb-2 text-primary-gradient">
            {t('loginWelcome')}
          </h1>
          <CardDescription>{t('loginDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && <p className="text-sm text-center text-destructive">{error}</p>}
          <Button variant="outline" type="button" className="w-full h-12 text-base bg-white text-gray-800 border-gray-300 hover:bg-gray-50 hover:text-gray-900" onClick={handleGoogleSignIn} disabled={anyLoading}>
            {isGoogleLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <GoogleIcon className="mr-2 h-5 w-5 text-[#4285F4]" />}
            {t('signInWithGoogle')}
          </Button>
          
          <div className="relative">
              <div className="absolute inset-0 flex items-center">
                  <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">{t('orContinueWith')}</span>
              </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={anyLoading}
                className="bg-black/20 backdrop-blur-sm border-white/10 h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={anyLoading}
                className="bg-black/20 backdrop-blur-sm border-white/10 h-12"
              />
            </div>
            <Button type="submit" className="w-full h-12 text-base bg-primary-gradient" disabled={anyLoading}>
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
              {t('loginWithEmail')}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
            <p className="text-sm text-center text-muted-foreground">
              {t('noAccount')}
              <Link href="/signup" className="font-semibold text-primary hover:underline">
                {t('signUp')}
              </Link>
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
