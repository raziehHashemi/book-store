// purchases/schemas/purchase.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Purchase extends Document {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: [{ type: String, ref: 'Book' }], required: true })
  bookIds: string[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ default: Date.now })
  purchaseDate: Date;
  @Prop({ default: 'pending' })
  status: 'pending' | 'completed' | 'failed';

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
