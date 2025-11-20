
// This is a mock email service for demonstration purposes.
// In a real application, this would be a server-side function
// that uses a service like SendGrid, Twilio, etc.

type SendEmailParams = {
  to: string;
  name: string;
  message: string;
  channel: 'Email' | 'SMS' | 'WhatsApp';
};

export function sendReminderEmail({ to, name, message, channel }: SendEmailParams) {
  console.log('--- THIS FUNCTION IS DEPRECATED. EMAIL LOGIC IS NOW HANDLED BY WRITING TO THE `mail` COLLECTION IN FIRESTORE ---');
  console.log('--- SIMULATING SENDING REMINDER ---');
  console.log(`Channel: ${channel}`);
  console.log(`To: ${name} <${to}>`);
  console.log(`Message: "${message}"`);
  console.log(`Timestamp: ${new Date().toLocaleString()}`);
  console.log('------------------------------------');
  
  // The new logic in `reminder-processor.tsx` now handles this by writing a document
  // to the `mail` collection in Firestore, which can be picked up by the 
  // "Trigger Email" Firebase Extension.
}
