import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';

export async function POST(req: Request) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId
        } = await req.json();

        // 1. Verify Signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // 2. Update Order in Database
            await connectDB();
            
            const updatedOrder = await Order.findByIdAndUpdate(
                orderId,
                { 
                    status: 'Processing',
                    paymentStatus: 'Paid',
                    paymentId: razorpay_payment_id,
                    razorpayOrderId: razorpay_order_id
                },
                { new: true }
            );

            if (!updatedOrder) {
                return NextResponse.json({ message: 'Order not found in database' }, { status: 404 });
            }

            return NextResponse.json({ 
                success: true, 
                message: 'Payment verified successfully',
                order: updatedOrder
            });
        } else {
            return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 400 });
        }
    } catch (error: any) {
        console.error('Razorpay Verification Error:', error);
        return NextResponse.json({ message: 'Verification failed', error: error.message }, { status: 500 });
    }
}
