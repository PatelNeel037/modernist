import { Resend } from 'resend';

/**
 * Currency Utility (Internal for emails)
 */
const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

// Helper to lazily initialize Resend
const getResend = () => {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
        console.error("DEBUG: RESEND_API_KEY is missing from process.env");
    }
    return resendApiKey ? new Resend(resendApiKey) : null;
};

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
    size?: string;
}

interface OrderData {
    id: string;
    items: OrderItem[];
    totalAmount: number;
    shippingAddress: {
        name?: string;
        firstName?: string;
        lastName?: string;
        street: string;
        city: string;
        state: string;
        zip: string;
    };
    userEmail?: string;
    userName?: string;
    guestInfo?: {
        email: string;
        name: string;
    };
    userId?: {
        email?: string;
        name?: string;
    } | string;
}

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
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/shop" style="background-color: #111827; color: #ffffff; padding: 14px 32px; text-decoration: none; font-size: 16px; border-radius: 4px; font-weight: bold; letter-spacing: 1px;">SHOP NEW ARRIVALS</a>
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
                from: 'Modernist Team <onboarding@resend.dev>',
                to: email,
                subject: 'Welcome to MODERNIST',
                html: htmlContent,
            });
        } catch (error) {
            console.error("Resend Error:", error);
        }
    }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-w-xl; margin: 0 auto; padding: 40px; color: #111827; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 28px; font-weight: bold; letter-spacing: 2px; margin: 0;">MODERNIST</h1>
        </div>
        <h2 style="font-size: 24px; font-weight: normal; margin-bottom: 20px;">Reset your password.</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #4B5563; margin-bottom: 30px;">
            You requested to reset your password. Click the button below to choose a new one. This link will expire in 15 minutes.
        </p>
        <div style="text-align: center; margin-top: 40px; margin-bottom: 40px;">
            <a href="${resetLink}" style="background-color: #111827; color: #ffffff; padding: 14px 32px; text-decoration: none; font-size: 16px; border-radius: 4px; font-weight: bold; letter-spacing: 1px;">RESET PASSWORD</a>
        </div>
        <p style="font-size: 14px; color: #9CA3AF; margin-bottom: 30px;">
            If you didn't request this, you can safely ignore this email.
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
                subject: 'Reset Your Password - MODERNIST',
                html: htmlContent,
            });
        } catch (error) {
            console.error("Resend Error (Password Reset):", error);
        }
    }
};

export const sendOrderConfirmationEmail = async (order: OrderData) => {
    const { items, totalAmount, shippingAddress, guestInfo, id } = order;
    let email = order.userEmail || guestInfo?.email || 'customer@example.com';
    let name = order.userName || guestInfo?.name || 'Valued Customer';

    if (typeof order.userId === 'object' && order.userId !== null) {
        email = email || order.userId.email || 'customer@example.com';
        name = name || order.userId.name || 'Valued Customer';
    }
    const firstName = name.split(' ')[0] || 'Customer';

    const itemsHtml = items.map((item: OrderItem) => `
        <tr>
            <td style="padding: 15px 0; border-bottom: 1px solid #E5E7EB;">
                <div style="font-weight: bold; font-size: 14px;">${item.name}</div>
                <div style="font-size: 12px; color: #6B7280; margin-top: 4px;">Qty: ${item.quantity} | Size: ${item.size || 'M'}</div>
            </td>
            <td style="padding: 15px 0; border-bottom: 1px solid #E5E7EB; text-align: right; font-weight: bold;">
                ${formatINR(item.price * item.quantity)}
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
            Hi ${firstName}, we've received your order <strong>#${id}</strong> and are getting it ready to ship.
        </p>
        
        <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #9CA3AF; border-bottom: 2px solid #111827; padding-bottom: 10px; margin-bottom: 0;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <tbody>
                ${itemsHtml}
                <tr>
                    <td style="padding: 20px 0 10px 0; font-size: 14px; color: #6B7280;">Shipping</td>
                    <td style="padding: 20px 0 10px 0; text-align: right; font-size: 14px; color: #10B981; font-weight: bold;">FREE</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; font-size: 18px; font-weight: bold;">Total</td>
                    <td style="padding: 10px 0; text-align: right; font-size: 18px; font-weight: bold;">${formatINR(totalAmount)}</td>
                </tr>
            </tbody>
        </table>

        <div style="background-color: #F9FAFB; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h4 style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #9CA3AF; margin: 0 0 10px 0;">Shipping To</h4>
            <p style="font-size: 14px; margin: 0; color: #111827; font-weight: bold;">${shippingAddress.firstName || shippingAddress.name} ${shippingAddress.lastName || ''}</p>
            <p style="font-size: 14px; margin: 4px 0; color: #4B5563;">${shippingAddress.street}</p>
            <p style="font-size: 14px; margin: 0; color: #4B5563;">${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zip}</p>
        </div>

         <div style="text-align: center; margin-top: 40px; margin-bottom: 40px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders" style="background-color: #111827; color: #ffffff; padding: 14px 32px; text-decoration: none; font-size: 16px; border-radius: 8px; font-weight: bold; letter-spacing: 1px;">VIEW ORDER</a>
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
                from: 'Modernist Orders <onboarding@resend.dev>',
                to: email,
                subject: `Order Confirmation: #${id}`,
                html: htmlContent,
            });
        } catch (error) {
            console.error("Resend Error:", error);
        }
    }
};

export const sendOrderStatusEmail = async (email: string, name: string, orderId: string, status: string, trackingId?: string) => {
    const firstName = name.split(' ')[0] || 'Customer';
    const capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1);
    
    // Status specific messages
    let statusMessage = `Your order #${orderId} has been updated to: <strong>${capitalizedStatus}</strong>.`;
    if (status.toLowerCase() === 'shipped') {
        statusMessage = `Great news! Your order #${orderId} is on its way.`;
    } else if (status.toLowerCase() === 'delivered') {
        statusMessage = `Your order #${orderId} has been delivered. Enjoy your new pulse of fashion.`;
    }

    const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-w-xl; margin: 0 auto; padding: 40px; color: #111827; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 28px; font-weight: bold; letter-spacing: 2px; margin: 0;">MODERNIST</h1>
        </div>
        <h2 style="font-size: 24px; font-weight: normal; margin-bottom: 20px;">Order Update</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #4B5563; margin-bottom: 20px;">
            Hi ${firstName},
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #4B5563; margin-bottom: 30px;">
            ${statusMessage}
        </p>

        ${trackingId ? `
        <div style="background-color: #F9FAFB; padding: 24px; border-radius: 8px; margin-bottom: 30px; border: 1px solid #E5E7EB;">
            <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #9CA3AF; margin: 0 0 8px 0;">Tracking ID</p>
            <p style="font-size: 18px; font-weight: bold; margin: 0; color: #111827;">${trackingId}</p>
        </div>
        ` : ''}

        <div style="text-align: center; margin-top: 40px; margin-bottom: 40px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders" style="background-color: #111827; color: #ffffff; padding: 14px 32px; text-decoration: none; font-size: 16px; border-radius: 4px; font-weight: bold; letter-spacing: 1px;">TRACK YOUR ORDER</a>
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
                from: 'Modernist Orders <onboarding@resend.dev>',
                to: email,
                subject: `Order Update: #${orderId} - ${capitalizedStatus}`,
                html: htmlContent,
            });
        } catch (error) {
            console.error("Resend Error (Status Email):", error);
        }
    }
};

export const sendVerificationEmail = async (email: string, name: string, code: string) => {
    const firstName = name.split(' ')[0] || 'there';

    const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-w-xl; margin: 0 auto; padding: 40px; color: #111827; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 28px; font-weight: bold; letter-spacing: 2px; margin: 0;">MODERNIST</h1>
        </div>
        <h2 style="font-size: 24px; font-weight: normal; margin-bottom: 20px;">Verify your email.</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #4B5563; margin-bottom: 30px;">
            Hi ${firstName}, use the following code to verify your account. This code will expire in 10 minutes.
        </p>
        <div style="text-align: center; margin-top: 40px; margin-bottom: 40px; background-color: #F3F4F6; padding: 20px; border-radius: 8px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 12px; color: #111827;">${code}</span>
        </div>
        <div style="border-top: 1px solid #E5E7EB; padding-top: 30px; text-align: center;">
            <p style="font-size: 12px; color: #9CA3AF; margin: 0;">© ${new Date().getFullYear()} MODERNIST. All rights reserved.</p>
        </div>
    </div>
    `;

    const resend = getResend();
    if (resend) {
        try {
            console.log(`Attempting to send verification email to: ${email}`);
            const data = await resend.emails.send({
                from: 'Modernist Security <onboarding@resend.dev>',
                to: email,
                subject: 'Your Verification Code - MODERNIST',
                html: htmlContent,
            });
            console.log("Resend Response Data:", data);
        } catch (error: unknown) {
            const err = error as Error;
            console.error("Resend Sending Error Details:", {
                message: err.message,
                stack: err.stack,
                name: err.name
            });
        }
    } else {
        console.error("Resend API Key is missing or invalid. Check your .env file.");
    }
};
