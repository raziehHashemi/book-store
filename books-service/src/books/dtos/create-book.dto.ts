// ./dto/create-book.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  Max,
  IsIn,
} from 'class-validator';

export class CreateBookDto {
  /**
   * عنوان کتاب
   */
  @IsString()
  @IsNotEmpty()
  title: string;

  /**
   * نویسنده کتاب
   */
  @IsString()
  @IsNotEmpty()
  author: string;

  /**
   * ژانر کتاب
   */
  @IsString()
  @IsIn([
    'Fiction',
    'Non-Fiction',
    'Science',
    'History',
    'Fantasy',
    'Biography',
  ])
  genre: string;

  /**
   * سال انتشار کتاب
   */
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear())
  yearOfPublication: number;

  /**
   * قیمت کتاب
   */
  @IsNumber()
  @Min(0)
  price: number;

  /**
   * میزان محبوبیت کتاب
   * (این فیلد اختیاری است)
   */
  @IsNumber()
  @Min(0)
  @IsOptional()
  popularity?: number;
}
