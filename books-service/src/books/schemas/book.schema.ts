import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema({ timestamps: true })
export class Book extends Document {

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  author: string;

  @Prop({ type: String, required: true })
  genre: string;

  @Prop({ type: Number, required: true })
  yearOfPublication: number;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number, min: 1, max: 10, default: 1 })
  popularity: number;
}

export const BookSchema = SchemaFactory.createForClass(Book);
