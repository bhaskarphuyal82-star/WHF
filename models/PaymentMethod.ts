import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IPaymentMethod extends Document {
    type: 'esewa' | 'khalti' | 'bank' | 'fonepay';
    accountName: string;
    accountNumber: string;
    bankName?: string;
    qrCode?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const PaymentMethodSchema = new Schema<IPaymentMethod>(
    {
        type: {
            type: String,
            required: true,
            enum: ['esewa', 'khalti', 'bank', 'fonepay'],
            unique: true,
        },
        accountName: {
            type: String,
            required: true,
        },
        accountNumber: {
            type: String,
            required: true,
        },
        bankName: {
            type: String,
        },
        qrCode: {
            type: String,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const PaymentMethod = models.PaymentMethod || model<IPaymentMethod>("PaymentMethod", PaymentMethodSchema);

export default PaymentMethod;
