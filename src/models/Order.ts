import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    id: { type: String }, // product ID
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String },
    size: { type: String },
}, { _id: false }); // Prevents mongoose from creating an `_id` for each subdocument.

const addressSchema = new mongoose.Schema({
    name: { type: String },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    phone: { type: String },
}, { _id: false });

const orderSchema = new mongoose.Schema({
    userId: { type: String, default: 'GUEST' }, // Use GUEST for unauthenticated checkouts; MongoDB ObjectId if authenticated.
    userEmail: { type: String }, // Provided if guest
    guestInfo: {
        email: { type: String },
        phone: { type: String },
        name: { type: String }
    },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    shippingAddress: addressSchema,
    status: { type: String, default: "Pending", enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"] },
    paymentStatus: { type: String, default: "Pending", enum: ["Pending", "Paid", "Failed"] },
    carrier: { type: String },
    trackingId: { type: String },
    refundStatus: { type: String, enum: ["", "Refund Initiated", "Refund Processing", "Refunded"], default: "" },
    stripeSessionId: { type: String },
    razorpayOrderId: { type: String },
    paymentId: { type: String }
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
