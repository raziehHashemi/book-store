import { Controller, Get, Post, Body, Param, Query, Inject } from '@nestjs/common';
import { BooksService } from '../services/books.service';
import { MessagePattern } from '@nestjs/microservices';
import { SearchBooksDto } from '../dtos/search-book.dto';

@Controller('books')
export class BooksController {
	constructor(
		@Inject('BooksService') private readonly booksService: BooksService
	) { }

	@Get()
	findAll(@Query() query: SearchBooksDto) {
		try {
			return this.booksService.search(query);
		} catch (error) {

		}
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		try {
			return this.booksService.findOne(id);
		} catch (error) {

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
