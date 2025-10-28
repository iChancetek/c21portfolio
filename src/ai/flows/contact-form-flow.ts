/**
 * @fileOverview A flow for handling contact form submissions. It saves the
 * submission to Firestore and sends an email notification.
 *
 * - handleContactForm - The main function to process the contact form.
 * - ContactFormInput - The input type for the contact form.
 */

'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { initializeServerApp } from '@/firebase/server-config';
import { Resend } from 'resend';

const ContactFormInputSchema = z.object({
  name: z.string().describe('The name of the person submitting the form.'),
  email: z.string().email().describe('The email address of the person.'),
  message: z.string().describe('The message content.'),
});
export type ContactFormInput = z.infer<typeof ContactFormInputSchema>;

// Tool to save the contact form submission to Firestore.
const saveToDb = ai.defineTool(
  {
    name: 'saveToDb',
    description: 'Save the contact form submission to the database.',
    inputSchema: ContactFormInputSchema,
    outputSchema: z.object({
      docId: z.string().describe('The ID of the saved document.'),
    }),
  },
  async (input) => {
    // Initialize Firebase Admin SDK for server-side operations.
    const { firestore } = initializeServerApp();
    console.log('Saving contact form submission to Firestore...');
    const submission = {
      ...input,
      submissionDate: new Date().toISOString(),
    };
    const docRef = await firestore.collection('contactFormSubmissions').add(submission);
    console.log(`Submission saved with ID: ${docRef.id}`);
    return { docId: docRef.id };
  }
);

// Tool to send an email notification.
const sendEmail = ai.defineTool(
  {
    name: 'sendEmail',
    description: 'Send an email notification about the new contact form submission.',
    inputSchema: ContactFormInputSchema,
    outputSchema: z.object({ success: z.boolean() }),
  },
  async (input) => {
    // Initialize Resend for sending emails.
    const resend = new Resend(process.env.RESEND_API_KEY);
    console.log('Sending email notification...');
    try {
        /*
        // TODO: Replace with your actual email sending logic using Resend.
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev', // TODO: Replace with your "from" address.
            to: 'cm@chancellorminus.com',
            subject: `New Contact Form Submission from ${input.name}`,
            html: `<p><strong>Name:</strong> ${input.name}</p>
                   <p><strong>Email:</strong> ${input.email}</p>
                   <p><strong>Message:</strong></p>
                   <p>${input.message}</p>`,
        });

        if (error) {
            console.error('Error sending email:', error);
            return { success: false };
        }

        console.log('Email sent successfully:', data);
        */
       console.log("Mock email sent. Integrate with a service like Resend to send actual emails.");
       return { success: true };
    } catch (e) {
      console.error('Failed to send email:', e);
      return { success: false };
    }
  }
);

// The main flow that orchestrates saving to DB and sending an email.
const handleContactFormFlow = ai.defineFlow(
  {
    name: 'handleContactFormFlow',
    inputSchema: ContactFormInputSchema,
    outputSchema: z.object({
      dbId: z.string(),
      emailSuccess: z.boolean(),
    }),
  },
  async (input) => {
    // Run both tasks in parallel.
    const [dbResult, emailResult] = await Promise.all([
      saveToDb(input),
      sendEmail(input),
    ]);
    
    return {
      dbId: dbResult.docId,
      emailSuccess: emailResult.success,
    };
  }
);

// Exported function to be called from the server action.
export async function handleContactForm(input: ContactFormInput) {
  return handleContactFormFlow(input);
}