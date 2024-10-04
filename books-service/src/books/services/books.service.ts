import { Inject, Injectable } from '@nestjs/common';
import { Book } from '../schemas/book.schema';
import { CreateBookDto } from '../dtos/create-book.dto';
import { IBookRepository } from '../interfaces/book-repository.interface';
import { SearchBooksDto } from '../dtos/search-book.dto';
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Redis } from 'ioredis';
import { CacheManagerStore } from 'cache-manager';

@Injectable()
export class BooksService {
	constructor(
		@Inject('BookRepositoryService') private readonly bookRepository: IBookRepository,
		@Inject(CACHE_MANAGER) private readonly cacheManager: CacheManagerStore,
		@Inject('RedisClient') private readonly redisClient: Redis,
	) { }

	async incrementBookPopularity(book: Book): Promise<void> {
		try {
			const key = `popular_books:`;
			await this.redisClient.zincrby(`${key}visitCount`, 1, book.id);
			await this.cacheManager.set(`${key}:${book.id}:book`, book);
		} catch (error) {
			throw error;
		}
	}

	async getTopBooks(): Promise<Book[]> {
		try {
			const key = `popular_books:`;
			const topBookIds = await this.redisClient.zrevrange(`${key}:visitCount`, 0, 19);

			const topBooks = [];
			for (const bookId of topBookIds) {
				let book = await this.cacheManager.get(`${key}:${bookId}:book`);

				if (!book) {
					book = await this.bookRepository.findById(bookId);
					await this.cacheManager.set(`${key}:${bookId}:book`, book);
				}
				topBooks.push(book);
			}

			return topBooks;
		} catch (error) {
			throw error;
		}
	}

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
			await this.incrementBookPopularity(book);
			return book;
		} catch (error) {
			throw error;
		}
	}

	async findByIds(ids: string[]): Promise<Book[]> {
		try {
			const books = await this.bookRepository.findByIds(ids);
			return books;
		} catch (error) {
			throw error;
		}
	}
}
