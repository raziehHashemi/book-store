import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Book extends Document {

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    author: string;

    @Prop({ required: true })
    genre: string;

    @Prop({ required: true })
    yearOfPublication: number;

    @Prop({ required: true })
    price: number;

    @Prop({ default: 0 })
    popularity: number;
}

export const BookSchema = SchemaFactory.createForClass(Book);