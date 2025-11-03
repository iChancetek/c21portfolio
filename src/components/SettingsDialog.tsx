'use client';

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
import { useTheme } from 'next-themes';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Moon, Sun } from 'lucide-react';
import { Separator } from './ui/separator';

interface SettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SettingsDialog({ isOpen, onOpenChange }: SettingsDialogProps) {
  const { theme, setTheme } = useTheme();

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
            <Label>Change Password</Label>
            <Button variant="outline" className="w-full" disabled>
                Update Password (Coming Soon)
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
          
          <Separator />

          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select defaultValue="en" disabled>
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es" disabled>Español (Coming Soon)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
