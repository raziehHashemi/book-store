import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksService } from './services/books.service';
import { BooksController } from './controllers/books.controller';
import { Book, BookSchema } from './schemas/book.schema';
import { BookRepository } from './repositories/book.repository';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
	],
	controllers: [BooksController],
	providers: [
		{
			provide: 'BooksService',
			useClass: BooksService,
		},
		{
			provide: 'BookRepositoryService',
			useClass: BookRepository,
		}
	],
	exports: ['BooksService'],
})
export class BooksModule { }
