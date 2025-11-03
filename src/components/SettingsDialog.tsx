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

interface SettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SettingsDialog({ isOpen, onOpenChange }: SettingsDialogProps) {
  const { theme, setTheme } = useTheme();
  const { user } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  
  const [newDisplayName, setNewDisplayName] = useState(user?.displayName || '');
  const [isSavingName, setIsSavingName] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [language, setLanguage] = useState('en');

  const handleDisplayNameUpdate = async () => {
    if (!user || newDisplayName.trim() === user.displayName) {
      return;
    }
    setIsSavingName(true);
    try {
      await updateProfile(user, { displayName: newDisplayName.trim() });
      toast({
        title: 'Success',
        description: 'Your display name has been updated.',
      });
      // No need to close dialog, user might want to change other settings
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: 'Error',
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
          title: 'Error',
          description: 'No email address found for this account.',
          variant: 'destructive',
      });
      return;
    }
    setIsSendingReset(true);
    try {
        await sendPasswordResetEmail(auth, user.email);
        toast({
            title: 'Password Reset Email Sent',
            description: 'Please check your inbox for instructions to reset your password.',
        });
        onOpenChange(false);
    } catch (error) {
        const authError = error as AuthError;
        toast({
            title: 'Error Sending Reset Email',
            description: authError.message,
            variant: 'destructive',
        });
    } finally {
        setIsSendingReset(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your account and site preferences.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <div className="flex gap-2">
                <Input 
                    id="displayName"
                    value={newDisplayName}
                    onChange={(e) => setNewDisplayName(e.target.value)}
                    placeholder="Your display name"
                />
                <Button onClick={handleDisplayNameUpdate} disabled={isSavingName || newDisplayName === user?.displayName}>
                    {isSavingName && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save
                </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Change Password</Label>
            <p className="text-sm text-muted-foreground">Reset your password for your chancellorminus.com account.</p>
            <Button variant="outline" className="w-full" onClick={handlePasswordReset} disabled={isSendingReset}>
                {isSendingReset && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Password Reset Email
            </Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Site Mode</Label>
            <div className="flex gap-2">
                <Button variant={theme === 'light' ? 'default' : 'outline'} onClick={() => setTheme('light')} className="w-full">
                    <Sun className="mr-2 h-4 w-4" /> Light
                </Button>
                <Button variant={theme === 'dark' ? 'default' : 'outline'} onClick={() => setTheme('dark')} className="w-full">
                    <Moon className="mr-2 h-4 w-4" /> Dark
                </Button>
            </div>
          </div>

           <div className="space-y-2">
            <Label htmlFor="language">Language Preference</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español (Spanish)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Site content and AI interactions will use your preferred language.</p>
          </div>
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
