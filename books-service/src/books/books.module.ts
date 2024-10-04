import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { MongooseModule } from '@nestjs/mongoose';
import * as redisStore from 'cache-manager-ioredis';
import { BooksService } from './services/books.service';
import { BooksController } from './controllers/books.controller';
import { Book, BookSchema } from './schemas/book.schema';
import { BookRepository } from './repositories/book.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
		CacheModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				isGlobal: true,
				store: redisStore,
				host: configService.get('REDIS_HOST'),
				port: configService.get('REDIS_PORT'),

			}),
		}),
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
		},
	],
	exports: ['BooksService'],
})
export class BooksModule { }
