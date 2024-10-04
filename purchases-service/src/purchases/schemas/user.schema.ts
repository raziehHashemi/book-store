import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MEMBERSHIP_TYPE } from '../enums/membership.enum';

@Schema()
export class User extends Document {
    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: false })
    email: string;

    @Prop({ type: MEMBERSHIP_TYPE, required: true })
    membershipType: MEMBERSHIP_TYPE;

    @Prop({ default: Date.now })
    createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
