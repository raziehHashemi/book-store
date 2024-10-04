import { Controller, Get, Post, Body, Param, Query, Inject, Res, HttpStatus } from '@nestjs/common';
import { BooksService } from '../services/books.service';
import { MessagePattern } from '@nestjs/microservices';
import { SearchBooksDto } from '../dtos/search-book.dto';

@Controller('books')
export class BooksController {
	constructor(
		@Inject('BooksService') private readonly booksService: BooksService
	) { }

	@Get()
	async findAll(
		@Query() query: SearchBooksDto,
		@Res() res
	) {
		try {
			const books = await this.booksService.search(query);
			return res.status(HttpStatus.OK).json({
				statusCode: HttpStatus.OK,
				message: 'Books are found successfully',
				data: books,
			});
		} catch (error) {
			return res.status(HttpStatus.BAD_REQUEST).json({
				statusCode: HttpStatus.BAD_REQUEST,
				message: 'Error in returnin books.',
				error: error.message,
			});
		}
	}

	@Get(':id')
	async findOne(
		@Param('id') id: string,
		@Res() res
	) {
		try {
			const book = await this.booksService.findOne(id);
			return res.status(HttpStatus.OK).json({
				statusCode: HttpStatus.OK,
				message: 'Book is found successfully',
				data: book,
			});
		} catch (error) {
			return res.status(HttpStatus.BAD_REQUEST).json({
				statusCode: HttpStatus.BAD_REQUEST,
				message: 'Error in returnin books.',
				error: error.message,
			});
		}
	}

	@Get('popular')
	async getTopBooks(
		@Res() res
	) {
		try {
			const books = await this.booksService.getTopBooks();
			return res.status(HttpStatus.OK).json({
				statusCode: HttpStatus.OK,
				message: 'Books are found successfully',
				data: books,
			});
		} catch (error) {
			return res.status(HttpStatus.BAD_REQUEST).json({
				statusCode: HttpStatus.BAD_REQUEST,
				message: 'Error in returnin books.',
				error: error.message,
			});
		}
	}

	@MessagePattern({ cmd: 'find_book_by_id' })
	async findBookById(id: string) {
		try {
			return await this.booksService.findOne(id);
		} catch (error) {
			throw error;
		}
	}

	@MessagePattern({ cmd: 'find_books_by_ids' })
	async findBookByIds(ids: string[]) {
		try {
			return await this.booksService.findByIds(ids);
		} catch (error) {
			throw error;
		}
	}
}
