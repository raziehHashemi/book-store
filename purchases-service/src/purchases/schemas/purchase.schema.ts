import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Purchase extends Document {
    @Prop({ type: String, required: true })
    userId: string;

    @Prop({ type: [{ type: String, ref: 'Book' }], required: true })
    bookIds: string[];

    @Prop({ type: Number, required: true })
    totalAmount: number;

    @Prop({ type: Number, required: false })
    totalAmountWithDiscount: number;

    @Prop({ default: Date.now })
    purchaseDate: Date;

    @Prop({ default: 'pending' })
    status: 'pending' | 'completed' | 'failed';

    @Prop({ default: Date.now })
    createdAt: Date;
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
PurchaseSchema.index({ userId: 1 });
