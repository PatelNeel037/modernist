import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Subscriber from '@/models/Subscriber';
import { validateEmail } from '@/lib/validation';

export async function POST(req: Request) {
    try {
        await connectDB();
        const { email } = await req.json();

        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            return NextResponse.json({ message: emailValidation.message }, { status: 400 });
        }

        // Check if already subscribed
        const existing = await Subscriber.findOne({ email });
        if (existing) {
            return NextResponse.json({ message: 'You are already subscribed!' }, { status: 200 });
        }

        await Subscriber.create({ email });
        return NextResponse.json({ success: true, message: 'Welcome to the list!' });
    } catch (error) {
        return NextResponse.json({ message: 'Error subscribing' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    // Only for admin use (though we should ideally add auth check here or use a separate admin route)
    try {
        await connectDB();
        const subscribers = await Subscriber.find().sort({ createdAt: -1 });
        return NextResponse.json(subscribers);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching subscribers' }, { status: 500 });
    }
}
