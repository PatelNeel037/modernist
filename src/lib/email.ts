import { Resend } from 'resend';

// Helper to lazily initialize Resend so we pick up hot-reloaded env variables
const getResend = () => {
    const resendApiKey = process.env.RESEND_API_KEY;
    return resendApiKey ? new Resend(resendApiKey) : null;
};

export const sendWelcomeEmail = async (email: string, name: string) => {
    const firstName = name.split(' ')[0] || 'there';

    const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-w-xl; margin: 0 auto; padding: 40px; color: #111827; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 28px; font-weight: bold; letter-spacing: 2px; margin: 0;">MODERNIST</h1>
        </div>
        <h2 style="font-size: 24px; font-weight: normal; margin-bottom: 20px;">Welcome to the club, ${firstName}.</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #4B5563; margin-bottom: 30px;">
            We're thrilled to have you here. Your account has been successfully created. Explore our latest collections of modern, minimalist apparel designed for everyday elegance.
        </p>
        <div style="text-align: center; margin-top: 40px; margin-bottom: 40px;">
            <a href="https://modernist-store.com/shop" style="background-color: #111827; color: #ffffff; padding: 14px 32px; text-decoration: none; font-size: 16px; border-radius: 4px; font-weight: bold; letter-spacing: 1px;">SHOP NEW ARRIVALS</a>
        </div>
        <div style="border-top: 1px solid #E5E7EB; padding-top: 30px; text-align: center;">
            <p style="font-size: 12px; color: #9CA3AF; margin: 0;">© ${new Date().getFullYear()} MODERNIST. All rights reserved.</p>
            <p style="font-size: 12px; color: #9CA3AF; margin: 5px 0 0 0;">You are receiving this because you signed up on our store.</p>
        </div>
    </div>
    `;

    const resend = getResend();

    if (resend) {
        try {
            await resend.emails.send({
                from: 'Modernist Team <onboarding@resend.dev>', // MUST be this on free tier
                to: email, // Note: on free tier, this MUST be the email you signed up to Resend with!
                subject: 'Welcome to MODERNIST',
                html: htmlContent,
            });
            console.log("Welcome email sent via Resend to", email);
        } catch (error) {
            console.error("Failed to send Welcome email via Resend:", error);
        }
    } else {
        console.log(`[MOCK EMAIL] To: ${email} | Subject: Welcome to MODERNIST`);
        console.log("Email body (HTML) ready for delivery.");
    }
};

export const sendOrderConfirmationEmail = async (email: string, name: string, orderId: string, items: any[], totalAmount: number) => {
    const firstName = name.split(' ')[0] || 'Customer';

    const itemsHtml = items.map(item => `
        <tr>
            <td style="padding: 15px 0; border-bottom: 1px solid #E5E7EB;">
                <div style="font-weight: bold; font-size: 14px;">${item.name}</div>
                <div style="font-size: 12px; color: #6B7280; mt-1">Qty: ${item.quantity} | Size: ${item.size || 'M'}</div>
            </td>
            <td style="padding: 15px 0; border-bottom: 1px solid #E5E7EB; text-align: right; font-weight: bold;">
                $${(item.price * item.quantity).toFixed(2)}
            </td>
        </tr>
    `).join('');

    const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-w-xl; margin: 0 auto; padding: 40px; color: #111827; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 28px; font-weight: bold; letter-spacing: 2px; margin: 0;">MODERNIST</h1>
        </div>
        <h2 style="font-size: 24px; font-weight: normal; margin-bottom: 10px;">Order Confirmed</h2>
        <p style="font-size: 16px; color: #4B5563; margin-top: 0; margin-bottom: 30px;">
            Hi ${firstName}, we've received your order <strong>#${orderId}</strong> and are getting it ready to ship. We'll send you another email when it dispatches.
        </p>
        
        <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #9CA3AF; border-bottom: 2px solid #111827; padding-bottom: 10px; margin-bottom: 0;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <tbody>
                ${itemsHtml}
                <tr>
                    <td style="padding: 20px 0 10px 0; font-size: 14px; color: #6B7280;">Shipping</td>
                    <td style="padding: 20px 0 10px 0; text-align: right; font-size: 14px;">Free</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; font-size: 18px; font-weight: bold;">Total</td>
                    <td style="padding: 10px 0; text-align: right; font-size: 18px; font-weight: bold;">$${totalAmount.toFixed(2)}</td>
                </tr>
            </tbody>
        </table>

         <div style="text-align: center; margin-top: 40px; margin-bottom: 40px;">
            <a href="https://modernist-store.com/orders" style="background-color: #111827; color: #ffffff; padding: 14px 32px; text-decoration: none; font-size: 16px; border-radius: 4px; font-weight: bold; letter-spacing: 1px;">VIEW ORDER</a>
        </div>

        <div style="border-top: 1px solid #E5E7EB; padding-top: 30px; text-align: center;">
            <p style="font-size: 12px; color: #9CA3AF; margin: 0;">© ${new Date().getFullYear()} MODERNIST. All rights reserved.</p>
        </div>
    </div>
    `;

    const resend = getResend();

    if (resend) {
        try {
            await resend.emails.send({
                from: 'Modernist Orders <onboarding@resend.dev>', // MUST be this on free tier
                to: email, // Note: on free tier, this MUST be the email you signed up to Resend with!
                subject: `Order Confirmation: #${orderId}`,
                html: htmlContent,
            });
            console.log("Order confirmation email sent via Resend to", email);
        } catch (error) {
            console.error("Failed to send Order Confirmation email via Resend:", error);
        }
    } else {
        console.log(`[MOCK EMAIL] To: ${email} | Subject: Order Confirmation: #${orderId}`);
        console.log("Email body (HTML) ready for delivery.");
    }
};

export const sendOrderStatusEmail = async (email: string, name: string, orderId: string, status: string, trackingId?: string) => {
    const firstName = name?.split(' ')[0] || 'Customer';

    let statusMessage = '';
    let subject = '';

    if (status === 'shipped') {
        subject = `Your Order #${orderId} has Shipped!`;
        statusMessage = `Great news! Your order is on its way. ${trackingId ? `You can track it using tracking number: <strong>${trackingId}</strong>.` : ''}`;
    } else if (status === 'delivered') {
        subject = `Your Order #${orderId} has been Delivered!`;
        statusMessage = `Your package has arrived! We hope you love your new modern essentials.`;
    } else if (status === 'cancelled') {
        subject = `Update on Order #${orderId} (Cancelled)`;
        statusMessage = `Your order has been cancelled. If you have any questions or this was a mistake, please reach out to our support team.`;
    } else if (status === 'processing') {
        subject = `Update on Order #${orderId} (Processing)`;
        statusMessage = `We have started processing your order. We'll let you know as soon as it ships!`;
    } else {
        subject = `Update on your Order #${orderId}`;
        statusMessage = `The status of your order has been updated to: <strong>${status}</strong>.`;
    }

    const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-w-xl; margin: 0 auto; padding: 40px; color: #111827; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 28px; font-weight: bold; letter-spacing: 2px; margin: 0;">MODERNIST</h1>
        </div>
        <h2 style="font-size: 24px; font-weight: normal; margin-bottom: 10px;">Order Update</h2>
        <p style="font-size: 16px; color: #4B5563; line-height: 1.6; margin-top: 0; margin-bottom: 30px;">
            Hi ${firstName},<br><br>${statusMessage}
        </p>

        <div style="text-align: center; margin-top: 40px; margin-bottom: 40px;">
            <a href="https://modernist-store.com/orders" style="background-color: #111827; color: #ffffff; padding: 14px 32px; text-decoration: none; font-size: 16px; border-radius: 4px; font-weight: bold; letter-spacing: 1px;">VIEW ORDER STATUS</a>
        </div>

        <div style="border-top: 1px solid #E5E7EB; padding-top: 30px; text-align: center;">
            <p style="font-size: 12px; color: #9CA3AF; margin: 0;">© ${new Date().getFullYear()} MODERNIST. All rights reserved.</p>
        </div>
    </div>
    `;

    const resend = getResend();

    if (resend) {
        try {
            await resend.emails.send({
                from: 'Modernist Updates <onboarding@resend.dev>',
                to: email,
                subject: subject,
                html: htmlContent,
            });
            console.log("Order status email sent via Resend to", email);
        } catch (error) {
            console.error("Failed to send Order Status email via Resend:", error);
        }
    } else {
        console.log(`[MOCK EMAIL] To: ${email} | Subject: ${subject}`);
    }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
    // In production, you would use your actual domain
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetLink = `${appUrl}/reset-password?token=${token}`;

    const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-w-xl; margin: 0 auto; padding: 40px; color: #111827; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 28px; font-weight: bold; letter-spacing: 2px; margin: 0;">MODERNIST</h1>
        </div>
        <h2 style="font-size: 20px; font-weight: normal; margin-bottom: 20px;">Password Reset Request</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #4B5563; margin-bottom: 30px;">
            We received a request to reset your password. Click the button below to choose a new password. This link will expire in 15 minutes.
        </p>
        <div style="text-align: center; margin-top: 30px; margin-bottom: 40px;">
            <a href="${resetLink}" style="background-color: #111827; color: #ffffff; padding: 14px 32px; text-decoration: none; font-size: 16px; border-radius: 4px; font-weight: bold; letter-spacing: 1px;">RESET PASSWORD</a>
        </div>
        <p style="font-size: 14px; color: #6B7280; margin-bottom: 30px;">
            If you didn't request a password reset, you can safely ignore this email.
        </p>
        <div style="border-top: 1px solid #E5E7EB; padding-top: 30px; text-align: center;">
            <p style="font-size: 12px; color: #9CA3AF; margin: 0;">© ${new Date().getFullYear()} MODERNIST. All rights reserved.</p>
        </div>
    </div>
    `;

    const resend = getResend();

    if (resend) {
        try {
            await resend.emails.send({
                from: 'Modernist Security <onboarding@resend.dev>',
                to: email,
                subject: 'Reset your password',
                html: htmlContent,
            });
            console.log("Password reset email sent via Resend to", email);
        } catch (error) {
            console.error("Failed to send Password Reset email via Resend:", error);
        }
    } else {
        console.log(`[MOCK EMAIL] To: ${email} | Subject: Reset your password`);
        console.log(`Reset Link: ${resetLink}`);
    }
};
