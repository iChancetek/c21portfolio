'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Loader2, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { submitContactForm } from '@/app/actions';
import { useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useLocale } from '@/hooks/useLocale';

function SubmitButton() {
  const { pending } = useFormStatus();
  const { t } = useLocale();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-primary-gradient">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
      {t('sendMessage')}
    </Button>
  );
}

export default function Contact() {
  const initialState = { message: '', errors: {}, success: false, data: null };
  const [state, dispatch] = useActionState(submitContactForm, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const firestore = useFirestore();
  const submissionHandled = useRef(false);
  const { t } = useLocale();

  useEffect(() => {
    if (state.success && state.data && !submissionHandled.current) {
      toast({
        title: t('toastSuccess'),
        description: state.message,
      });

      if (firestore) {
        const submissionsCollection = collection(firestore, 'contactFormSubmissions');
        addDocumentNonBlocking(submissionsCollection, state.data);
      }
      
      formRef.current?.reset();
      submissionHandled.current = true;
      
    } else if (!state.success && state.message) {
      toast({
        title: t('toastError'),
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast, firestore, t]);

  return (
    <section id="contact" className="py-16 md:py-24 lg:py-32 relative bg-background overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary to-transparent"></div>
      <div className="container relative z-10 flex justify-center">
        <Card className="w-full max-w-xl group relative flex flex-col h-full overflow-hidden rounded-xl border border-white/10 bg-black/30 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 hover:shadow-2xl hover:shadow-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary-gradient">{t('contactTitle')}</CardTitle>
            <CardDescription className="text-slate-400">{t('contactDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form ref={formRef} action={dispatch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-400">{t('yourName')}</Label>
                <Input id="name" name="name" placeholder={t('yourName')} className="bg-black/20 backdrop-blur-sm border-white/10 focus:bg-black/30" />
                {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-400">Email</Label>
                <Input id="email" name="email" type="email" placeholder={t('yourEmail')} className="bg-black/20 backdrop-blur-sm border-white/10 focus:bg-black/30" />
                 {state.errors?.email && <p className="text-sm text-destructive">{state.errors.email[0]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-slate-400">{t('yourMessage')}</Label>
                <Textarea id="message" name="message" placeholder={t('yourMessage')} className="min-h-[120px] bg-black/20 backdrop-blur-sm border-white/10 focus:bg-black/30" />
                 {state.errors?.message && <p className="text-sm text-destructive">{state.errors.message[0]}</p>}
              </div>
              <SubmitButton />
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
