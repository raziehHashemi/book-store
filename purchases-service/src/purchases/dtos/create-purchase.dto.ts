// purchases/dto/create-purchase.dto.ts

import { IsNotEmpty, IsString, IsArray, IsNumber, IsOptional, IsEnum } from 'class-validator';

export class CreatePurchaseDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  bookIds: string[];

  @IsNotEmpty()
  @IsNumber()
  totalAmount: number;

  @IsOptional()
  @IsEnum(['pending', 'completed', 'cancelled'])
  @IsString()
  status: string;
}
