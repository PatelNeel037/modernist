import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(req: Request) {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature') as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any;
        const orderId = session.metadata.orderId;

        await connectDB();
        
        // Update order status to internal Paid
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { 
                paymentStatus: 'Paid',
                status: 'Processing' // Or 'Confirmed'
            },
            { new: true }
        );

        if (updatedOrder) {
            console.log(`Order ${orderId} marked as Paid.`);
            // Send email confirmation
            try {
                // Adapt updatedOrder to the format expected by sendOrderConfirmationEmail
                const orderObj = updatedOrder.toObject();
                orderObj.id = orderObj._id.toString();
                
                await sendOrderConfirmationEmail(orderObj);
            } catch (emailErr) {
                console.error('Failed to send confirmation email:', emailErr);
            }
        }
    }

    return NextResponse.json({ received: true });
}
