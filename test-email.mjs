// test-email.js
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) {
    console.error("No RESEND_API_KEY found in .env.local");
    process.exit(1);
}

const resend = new Resend(resendApiKey);

async function testEmail() {
    try {
        const data = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'patelronit644@gmail.com', // Replace with the email you signed up to Resend with
            subject: 'Test Email from Resend',
            html: '<p>This is a test email sent using the Resend Node.js SDK.</p>'
        });

        console.log("Email sent successfully!");
        console.log(data);
    } catch (error) {
        console.error("Failed to send email:", error);
    }
}

testEmail();
