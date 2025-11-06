'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { useTheme } from 'next-themes';
import { useUser, useAuth } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { updateProfile, sendPasswordResetEmail, AuthError } from 'firebase/auth';
import { Moon, Sun, Loader2 } from 'lucide-react';
import { Separator } from './ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLocale } from '@/hooks/useLocale';

interface SettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SettingsDialog({ isOpen, onOpenChange }: SettingsDialogProps) {
  const { theme, setTheme } = useTheme();
  const { user } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const { locale, setLocale, t, locales } = useLocale();
  
  const [newDisplayName, setNewDisplayName] = useState(user?.displayName || '');
  const [isSavingName, setIsSavingName] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const handleDisplayNameUpdate = async () => {
    if (!user || !newDisplayName.trim() || newDisplayName.trim() === user.displayName) {
      return; // No change, no need to update
    }
    setIsSavingName(true);
    try {
      await updateProfile(user, { displayName: newDisplayName.trim() });
      toast({
        title: t('success'),
        description: t('displayNameUpdated'),
      });
      // Force a reload to reflect the change everywhere
      window.location.reload();
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: t('error'),
        description: authError.message,
        variant: 'destructive',
      });
    } finally {
      setIsSavingName(false);
    }
  };
  
  const handlePasswordReset = async () => {
    if (!user?.email) {
      toast({
          title: t('error'),
          description: t('noEmailAddress'),
          variant: 'destructive',
      });
      return;
    }
    setIsSendingReset(true);
    try {
        await sendPasswordResetEmail(auth, user.email);
        toast({
            title: t('passwordResetEmailSent'),
            description: t('checkYourInbox'),
        });
    } catch (error) {
        const authError = error as AuthError;
        toast({
            title: t('errorSendingResetEmail'),
            description: authError.message,
            variant: 'destructive',
        });
    } finally {
        setIsSendingReset(false);
    }
  };

  const handleApplyAndClose = async () => {
    await handleDisplayNameUpdate();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('settings')}</DialogTitle>
          <DialogDescription>
            {t('settingsDescription')}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          
          <div className="space-y-2">
            <Label htmlFor="displayName">{t('displayName')}</Label>
            <div className="flex gap-2">
                <Input 
                    id="displayName"
                    value={newDisplayName}
                    onChange={(e) => setNewDisplayName(e.target.value)}
                    placeholder={t('yourDisplayName')}
                />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>{t('changePassword')}</Label>
            <p className="text-sm text-muted-foreground">{t('resetYourPassword')}</p>
            <Button variant="outline" className="w-full" onClick={handlePasswordReset} disabled={isSendingReset}>
                {isSendingReset && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('sendPasswordResetEmail')}
            </Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>{t('siteMode')}</Label>
            <div className="flex gap-2">
                <Button variant={theme === 'light' ? 'default' : 'outline'} onClick={() => setTheme('light')} className="w-full">
                    <Sun className="mr-2 h-4 w-4" /> {t('light')}
                </Button>
                <Button variant={theme === 'dark' ? 'default' : 'outline'} onClick={() => setTheme('dark')} className="w-full">
                    <Moon className="mr-2 h-4 w-4" /> {t('dark')}
                </Button>
            </div>
          </div>

           <div className="space-y-2">
            <Label htmlFor="language">{t('languagePreference')}</Label>
            <Select value={locale} onValueChange={(value) => setLocale(value as any)}>
              <SelectTrigger id="language">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                 {Object.entries(locales).map(([code, name]) => (
                    <SelectItem key={code} value={code}>{name}</SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">{t('languageDescription')}</p>
          </div>
        </div>
        <DialogFooter>
            <Button onClick={handleApplyAndClose} disabled={isSavingName}>
              {isSavingName && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('applyAndClose')}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
