import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max, IsIn, } from 'class-validator';

export class CreateBookDto {

	@IsString()
	@IsNotEmpty()
	title: string;

	@IsString()
	@IsNotEmpty()
	author: string;

	@IsString()
	@IsNotEmpty()
	genre: string;

	@IsNumber()
	@Min(1900)
	@Max(new Date().getFullYear())
	yearOfPublication: number;

	@IsNumber()
	@Min(0)
	price: number;

	@IsNumber()
	@Min(0)
	@IsOptional()
	popularity?: number;
}
