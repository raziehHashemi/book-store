import { Controller, Get, Post, Body, Param, Query, Inject, Res, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { BooksService } from '../services/books.service';
import { MessagePattern } from '@nestjs/microservices';
import { SearchBooksDto } from '../dtos/search-book.dto';

@ApiTags('Books')
@Controller('books')
export class BooksController {
	constructor(
		@Inject('BooksService') private readonly booksService: BooksService
	) { }

	@ApiOperation({ summary: 'Search books' })
	@ApiQuery({ name: 'title', required: false })
	@ApiQuery({ name: 'author', required: false })
	@ApiQuery({ name: 'genre', required: false })
	@ApiQuery({ name: 'year', required: false })
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

	@ApiOperation({ summary: 'Get a book by id' })
	@ApiParam({ name: 'id', required: true })
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

	@ApiOperation({ summary: 'Get 20 top popular books' })
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
