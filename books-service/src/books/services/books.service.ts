import { Inject, Injectable } from '@nestjs/common';
import { Book } from '../schemas/book.schema';
import { CreateBookDto } from '../dtos/create-book.dto';
import { IBookRepository } from '../interfaces/book-repository.interface';
import { SearchBooksDto } from '../dtos/search-book.dto';

@Injectable()
export class BooksService {
	constructor(
		@Inject('BookRepositoryService') private readonly bookRepository: IBookRepository
	) { }

	async create(createBookDto: CreateBookDto): Promise<Book> {
		try {
			const newBook = await this.bookRepository.create(createBookDto);
			return newBook;
		} catch (error) {
			throw error;
		}
	}

	async search(query: SearchBooksDto): Promise<Book[]> {
		try {
			const filter: any = {};

			if (query.title) filter.title = new RegExp(query.title, 'i');
			if (query.author) filter.author = new RegExp(query.author, 'i');
			if (query.genre) filter.genre = new RegExp(query.genre, 'i');
			if (query.year) filter.year = query.year;

			const books = await this.bookRepository.findAll(filter);
			return books;
		} catch (error) {
			throw error;
		}
	}

	async findOne(id: string): Promise<Book> {
		try {
			const book = await this.bookRepository.findById(id);
			return book;
		} catch (error) {
			throw error;
		}
	}
}
