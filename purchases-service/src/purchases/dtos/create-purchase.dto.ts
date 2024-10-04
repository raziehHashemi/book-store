import { IsNotEmpty, IsString, IsArray, IsNumber, IsOptional, IsEnum } from 'class-validator';

export class CreatePurchaseDto {
	@IsNotEmpty()
	@IsString()
	userId: string;

	@IsNotEmpty()
	@IsArray()
	@IsString({ each: true })
	bookIds: string[];

	@IsOptional()
	@IsNumber()
	totalAmount: number;

	@IsOptional()
	@IsEnum(['pending', 'completed', 'cancelled'])
	@IsString()
	status: string;

	@IsOptional()
	@IsNumber()
	totalAmountWithDiscount: number;
}
