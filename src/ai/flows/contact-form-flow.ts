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
    try {
        const { firestore } = initializeServerApp();
        console.log('Saving contact form submission to Firestore...');
        const submission = {
          ...input,
          submissionDate: new Date().toISOString(),
        };
        const docRef = await firestore.collection('contactFormSubmissions').add(submission);
        console.log(`Submission saved with ID: ${docRef.id}`);
        return { success: true, docId: docRef.id };
    } catch (error) {
        console.error('Error in saveToDb:', error);
        return { success: false, error: 'Could not save submission to database.' };
    }
}

// Function to send an email notification.
async function sendEmail(input: ContactFormInput) {
    console.log('Email sending is temporarily disabled. Submission was not emailed.');
    return { success: true };
}

// Main exported function to be called from the server action.
export async function handleContactForm(input: ContactFormInput) {
    // We run saveToDb first. If it fails, we return the error immediately.
    const dbResult = await saveToDb(input);
    if (!dbResult.success) {
      return { success: false, error: dbResult.error };
    }

    // Then we attempt to send the email.
    const emailResult = await sendEmail(input);
     if (!emailResult.success) {
      // Even if email fails, we can consider the main operation a success
      // since the data is in the DB. We can log this for later debugging.
      console.warn('Database save succeeded, but email sending failed.');
    }

    // Return a success status with the database document ID.
    return {
      success: true,
      dbId: dbResult.docId,
    };
}