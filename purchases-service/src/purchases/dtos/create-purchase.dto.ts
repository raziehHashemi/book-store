import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray, IsNumber, IsOptional, IsEnum } from 'class-validator';

export class CreatePurchaseDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	userId: string;

	@IsNotEmpty()
	@IsArray()
	@IsString({ each: true })
	@ApiProperty()
	bookIds: string[];

	@IsOptional()
	@IsNumber()
	@ApiProperty()
	totalAmount: number;

	@IsOptional()
	@IsEnum(['pending', 'completed', 'cancelled'])
	@IsString()
	@ApiProperty()
	status: string;

	@IsOptional()
	@IsNumber()
	@ApiProperty()
	totalAmountWithDiscount: number;
}
