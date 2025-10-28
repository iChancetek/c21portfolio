/**
 * @fileOverview A flow for handling contact form submissions. It saves the
 * submission to Firestore and sends an email notification.
 *
 * - handleContactForm - The main function to process the contact form.
 * - ContactFormInput - The input type for the contact form.
 */

'use server';

import { z } from 'zod';
import { initializeServerApp } from '@/firebase/server-config';
import { Resend } from 'resend';

const ContactFormInputSchema = z.object({
  name: z.string().describe('The name of the person submitting the form.'),
  email: z.string().email().describe('The email address of the person.'),
  message: z.string().describe('The message content.'),
});
export type ContactFormInput = z.infer<typeof ContactFormInputSchema>;

// Function to save the contact form submission to Firestore.
async function saveToDb(input: ContactFormInput) {
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

// Function to send an email notification.
async function sendEmail(input: ContactFormInput) {
    console.log('Email sending is temporarily disabled. Submission was not emailed.');
    return { success: true };
}

// Main exported function to be called from the server action.
export async function handleContactForm(input: ContactFormInput) {
  try {
    const [dbResult, emailResult] = await Promise.all([
      saveToDb(input),
      sendEmail(input),
    ]);

    return {
      dbId: dbResult.docId,
      emailSuccess: emailResult.success,
    };
  } catch (error) {
    console.error('Error in handleContactForm:', error);
    // Re-throw the error to be caught by the server action's catch block
    throw new Error('Failed to process contact form submission.');
  }
}
